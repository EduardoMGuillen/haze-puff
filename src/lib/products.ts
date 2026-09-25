import type { Product, ProductInput } from "./types";
import { loadProducts, saveProducts } from "./blob-store";

async function readAll(): Promise<Product[]> {
  return loadProducts();
}

async function writeAll(products: Product[]) {
  await saveProducts(products);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function getProducts(opts?: { includeInactive?: boolean }) {
  const products = await readAll();
  if (opts?.includeInactive) return products;
  return products.filter((p) => p.active);
}

export async function getProductById(id: string) {
  const products = await readAll();
  const decoded = decodeURIComponent(id);
  return products.find((p) => p.id === id || p.id === decoded) ?? null;
}

export async function createProduct(input: ProductInput) {
  const products = await readAll();
  const base = input.id || slugify(input.name) || `producto-${Date.now()}`;
  let id = base;
  let i = 1;
  while (products.some((p) => p.id === id)) {
    id = `${base}-${i++}`;
  }
  const product: Product = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    price: Number(input.price) || 0,
    image: input.image.trim(),
    category: input.category.trim() || "General",
    promo: Boolean(input.promo),
    active: input.active !== false,
    createdAt: new Date().toISOString(),
  };
  const next = [product, ...products];
  await writeAll(next);
  return { product, products: next };
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const products = await readAll();
  const decoded = decodeURIComponent(id);
  const idx = products.findIndex((p) => p.id === id || p.id === decoded);
  if (idx === -1) return null;
  const current = products[idx];
  const updated: Product = {
    ...current,
    name: input.name?.trim() ?? current.name,
    description: input.description?.trim() ?? current.description,
    price:
      input.price !== undefined ? Number(input.price) || 0 : current.price,
    image: input.image?.trim() ?? current.image,
    category: input.category?.trim() ?? current.category,
    promo: input.promo !== undefined ? Boolean(input.promo) : current.promo,
    active: input.active !== undefined ? Boolean(input.active) : current.active,
  };
  const next = [...products];
  next[idx] = updated;
  await writeAll(next);
  return { product: updated, products: next };
}

export async function deleteProduct(id: string) {
  let products: Product[] | null = null;
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      products = await readAll();
      break;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  if (!products) {
    throw lastError instanceof Error
      ? lastError
      : new Error("No se pudo leer el catálogo para eliminar");
  }

  const decoded = decodeURIComponent(id);
  const next = products.filter((p) => p.id !== id && p.id !== decoded);
  if (next.length === products.length) return null;
  await writeAll(next);
  return { products: next };
}
