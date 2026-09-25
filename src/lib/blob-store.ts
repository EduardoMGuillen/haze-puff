import {
  put,
  get,
  list,
  del,
  BlobAccessError,
  BlobNotFoundError,
} from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "./types";

/** Legacy single file — CDN cache of overwrites caused lost updates. */
const LEGACY_PRODUCTS_KEY = "hazepuff/products.json";
/** Each save writes a NEW pathname so reads never hit a stale overwrite. */
const CATALOG_PREFIX = "hazepuff/catalog/";
const LEGACY_PATH = path.join(process.cwd(), "data", "products.json");
const KEEP_CATALOG_VERSIONS = 8;

export function hasBlobStore() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

function blobAccess(): "public" | "private" {
  return process.env.BLOB_ACCESS === "private" ? "private" : "public";
}

function blobAuthOptions(): { token?: string; storeId?: string } {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN };
  }
  if (process.env.BLOB_STORE_ID) {
    return { storeId: process.env.BLOB_STORE_ID };
  }
  return {};
}

function blobHelpError(cause?: unknown) {
  const base =
    "Vercel Blob rechazó el acceso. Revisa BLOB_READ_WRITE_TOKEN, Blob Public y Redeploy.";
  if (cause instanceof Error && cause.message) {
    return `${base} Detalle: ${cause.message}`;
  }
  return base;
}

async function withBlobErrors<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof BlobAccessError) {
      throw new Error(blobHelpError(err));
    }
    throw err;
  }
}

async function readSeed(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(LEGACY_PATH, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function readFromLocal(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(LEGACY_PATH, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeToLocal(products: Product[]) {
  const payload = `${JSON.stringify(products, null, 2)}\n`;
  await fs.mkdir(path.dirname(LEGACY_PATH), { recursive: true });
  await fs.writeFile(LEGACY_PATH, payload, "utf8");
}

type BlobRead =
  | { status: "ok"; products: Product[] }
  | { status: "missing" };

function isNotFound(err: unknown) {
  if (err instanceof BlobNotFoundError) return true;
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  return (
    msg.includes("not found") ||
    msg.includes("does not exist") ||
    msg.includes("404")
  );
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text();
}

function parseProductsJson(text: string): Product[] {
  const parsed = JSON.parse(text) as Product[];
  return Array.isArray(parsed) ? parsed : [];
}

async function getProductsFromPath(
  urlOrPathname: string,
): Promise<Product[] | null> {
  const accessModes: Array<"public" | "private"> = [
    blobAccess(),
    blobAccess() === "public" ? "private" : "public",
  ];

  let lastErr: unknown;
  for (const access of accessModes) {
    try {
      const result = await get(urlOrPathname, {
        access,
        useCache: false,
        ...blobAuthOptions(),
      });
      if (!result) return null;
      if (result.statusCode !== 200 || !result.stream) {
        lastErr = new Error(`status ${result.statusCode}`);
        continue;
      }
      return parseProductsJson(await streamToText(result.stream));
    } catch (err) {
      if (isNotFound(err)) return null;
      lastErr = err;
    }
  }
  if (lastErr) throw lastErr;
  return null;
}

async function listCatalogVersions() {
  const { blobs } = await list({
    prefix: CATALOG_PREFIX,
    limit: 100,
    ...blobAuthOptions(),
  });
  return [...blobs].sort(
    (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime(),
  );
}

async function pruneOldCatalogVersions(
  versions: Awaited<ReturnType<typeof listCatalogVersions>>,
) {
  const stale = versions.slice(KEEP_CATALOG_VERSIONS);
  if (stale.length === 0) return;
  try {
    await del(
      stale.map((b) => b.url),
      blobAuthOptions(),
    );
  } catch {
    // Non-fatal: old versions just linger a bit
  }
}

/**
 * Read via list()+unique version URLs — never rely on overwriting one pathname
 * (Blob CDN can serve the previous JSON for ~60s after overwrite).
 */
async function readFromBlob(): Promise<BlobRead> {
  return withBlobErrors(async () => {
    const versions = await listCatalogVersions();
    if (versions.length > 0) {
      const latest = versions[0];
      const products = await getProductsFromPath(latest.url);
      if (products) return { status: "ok", products };
      throw new Error("No se pudo leer la última versión del catálogo");
    }

    // Migrate once from the legacy fixed pathname if it still exists
    try {
      const legacy = await getProductsFromPath(LEGACY_PRODUCTS_KEY);
      if (legacy) return { status: "ok", products: legacy };
    } catch (err) {
      if (!isNotFound(err)) throw err;
    }

    return { status: "missing" };
  });
}

async function writeToBlob(products: Product[]) {
  return withBlobErrors(async () => {
    const pathname = `${CATALOG_PREFIX}${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.json`;
    const payload = `${JSON.stringify(products, null, 2)}\n`;

    const tryPut = async (access: "public" | "private") => {
      await put(pathname, payload, {
        access,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: false,
        cacheControlMaxAge: 60,
        ...blobAuthOptions(),
      });
    };

    try {
      await tryPut(blobAccess());
    } catch (err) {
      if (!(err instanceof BlobAccessError)) throw err;
      await tryPut(blobAccess() === "public" ? "private" : "public");
    }

    try {
      const versions = await listCatalogVersions();
      await pruneOldCatalogVersions(versions);
    } catch {
      // ignore prune failures
    }
  });
}

export async function loadProducts(): Promise<Product[]> {
  if (hasBlobStore()) {
    const result = await readFromBlob();
    if (result.status === "ok") {
      return result.products;
    }
    const seed = await readSeed();
    await writeToBlob(seed);
    return seed;
  }
  return readFromLocal();
}

export async function saveProducts(products: Product[]) {
  if (hasBlobStore()) {
    await writeToBlob(products);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(blobHelpError());
  }

  await writeToLocal(products);
}

export async function uploadProductImage(
  file: Blob,
  filename: string,
): Promise<string> {
  if (!hasBlobStore()) {
    if (process.env.VERCEL) {
      throw new Error(blobHelpError());
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    await fs.writeFile(path.join(uploadDir, safe), buffer);
    return `/uploads/${safe}`;
  }

  return withBlobErrors(async () => {
    try {
      const blob = await put(`hazepuff/uploads/${filename}`, file, {
        access: blobAccess(),
        contentType: file.type || "image/jpeg",
        addRandomSuffix: true,
        ...blobAuthOptions(),
      });
      return blob.url;
    } catch (err) {
      if (!(err instanceof BlobAccessError)) throw err;
      const other = blobAccess() === "public" ? "private" : "public";
      const blob = await put(`hazepuff/uploads/${filename}`, file, {
        access: other,
        contentType: file.type || "image/jpeg",
        addRandomSuffix: true,
        ...blobAuthOptions(),
      });
      return blob.url;
    }
  });
}
