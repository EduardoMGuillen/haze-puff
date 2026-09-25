import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND, SITE_URL } from "@/lib/constants";
import { getProductById } from "@/lib/products";
import { whatsappBuyUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) {
    return { title: "Producto no encontrado" };
  }
  const title = `${product.name} · ${BRAND}`;
  const description = `${product.description} L ${product.price.toLocaleString("es-HN")}. Cofradía, Cortés.`;
  return {
    title: product.name,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/producto/${product.id}`,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) notFound();

  return (
    <div className="page">
      <Header />
      <section className="section">
        <div className="wrap product-hero">
          <div className="product-media" style={{ border: "1px solid rgba(180,77,255,0.28)" }}>
            {product.promo && <span className="badge">Promo</span>}
            <img src={product.image} alt={product.name} />
          </div>
          <div>
            <Link className="back-link" href="/#tienda">
              ← Volver a la tienda
            </Link>
            <p className="section-kicker" style={{ marginTop: "1rem" }}>
              {product.category}
            </p>
            <h1 className="display" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}>
              {product.name}
            </h1>
            <p className="lede">{product.description}</p>
            <p className="price" style={{ fontSize: "2rem", marginTop: 0 }}>
              L {product.price.toLocaleString("es-HN")}
            </p>
            <p style={{ marginTop: "1.2rem" }}>
              <a
                className="btn btn-wa"
                href={whatsappBuyUrl(product)}
                target="_blank"
                rel="noreferrer"
              >
                Comprar
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
