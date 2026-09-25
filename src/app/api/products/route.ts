import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  if (all) {
    const ok = await isAuthenticated();
    if (!ok) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }
  try {
    const products = await getProducts({ includeInactive: all });
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("GET products", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "No se pudo leer el catálogo",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.image) {
    return NextResponse.json(
      { error: "Nombre e imagen son obligatorios" },
      { status: 400 },
    );
  }

  try {
    const result = await createProduct({
      name: body.name,
      description: body.description || "",
      price: body.price ?? 0,
      image: body.image,
      category: body.category || "General",
      promo: Boolean(body.promo),
      active: body.active !== false,
    });

    return NextResponse.json(result, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("POST product", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "No se pudo guardar el producto.",
      },
      { status: 500 },
    );
  }
}
