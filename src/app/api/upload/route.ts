import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadProductImage } from "@/lib/blob-store";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el archivo (¿demasiado grande?)" },
      { status: 400 },
    );
  }

  const entry = formData.get("file");
  if (!entry || typeof entry === "string") {
    return NextResponse.json(
      { error: "Selecciona una imagen" },
      { status: 400 },
    );
  }

  // On Node, uploads are Blob-like (not always instanceof File)
  const file = entry as Blob;
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "La imagen debe pesar entre 1 KB y 8 MB (ya comprimida)" },
      { status: 400 },
    );
  }

  try {
    const name =
      "name" in entry && typeof (entry as File).name === "string"
        ? (entry as File).name
        : `producto-${Date.now()}.jpg`;
    const url = await uploadProductImage(file, name);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("upload", err);
    const message =
      err instanceof Error ? err.message : "No se pudo subir la imagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
