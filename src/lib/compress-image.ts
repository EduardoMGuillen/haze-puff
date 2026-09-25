const TARGET_BYTES = 1.5 * 1024 * 1024;
const HARD_MAX_BYTES = 8 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "No se pudo leer la imagen. Si es HEIC, exporta a JPG en el teléfono.",
        ),
      );
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("No se pudo comprimir la imagen"));
        else resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

/** Compress camera/gallery photo to a JPEG File under ~1.5 MB. */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file || file.size === 0) {
    throw new Error("Selecciona una imagen válida");
  }

  const mime = (file.type || "").toLowerCase();
  if (mime === "image/jpeg" && file.size <= TARGET_BYTES) {
    return file;
  }

  const img = await loadImage(file);
  let maxEdge = Math.min(2000, Math.max(img.width, img.height));
  let quality = 0.82;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 14; attempt++) {
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height, 1));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo procesar la imagen");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    blob = await canvasToBlob(canvas, quality);
    if (blob.size <= TARGET_BYTES) break;

    if (quality > 0.45) {
      quality = Math.round((quality - 0.08) * 100) / 100;
    } else {
      maxEdge = Math.max(640, Math.round(maxEdge * 0.72));
      quality = 0.7;
    }
  }

  if (!blob) throw new Error("No se pudo comprimir la imagen");
  if (blob.size > HARD_MAX_BYTES) {
    throw new Error("La imagen sigue siendo demasiado pesada tras comprimir");
  }

  const base = file.name.replace(/\.[^.]+$/, "") || `producto-${Date.now()}`;
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}
