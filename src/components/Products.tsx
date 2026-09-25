"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { whatsappBuyUrl } from "@/lib/whatsapp";

function formatPrice(price: number) {
  return `L ${price.toLocaleString("es-HN")}`;
}

type Props = {
  products: Product[];
  title?: string;
  limit?: number;
  seeAllHref?: string;
};

export default function Products({
  products,
  title = "La tienda",
  limit,
  seeAllHref,
}: Props) {
  const [filter, setFilter] = useState("all");
  const categories = useMemo(() => {
    return Array.from(
      new Set(products.filter((item) => item.active).map((item) => item.category)),
    ).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const visible = useMemo(() => {
    const active = products.filter(
      (item) => item.active && (filter === "all" || item.category === filter),
    );
    return typeof limit === "number" ? active.slice(0, limit) : active;
  }, [products, filter, limit]);

  return (
    <section className="section" id="tienda">
      <div className="wrap">
        <p className="section-kicker">Catálogo</p>
        <h2 className="display">{title}</h2>
        <p className="lede">
          Precios de referencia en lempiras. El stock cambia: confirma por
          WhatsApp antes de pasar.
        </p>
        <div className="filters">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <div className="empty">Todavía no hay productos en esta categoría.</div>
        ) : (
          <div className="product-grid">
            {visible.map((product) => (
              <article key={product.id} className="product-card">
                <Link href={`/producto/${product.id}`} className="product-media">
                  {product.promo && <span className="badge">Promo</span>}
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="product-body">
                  <small>{product.category}</small>
                  <h3>
                    <Link href={`/producto/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p>{product.description}</p>
                  <div className="product-row">
                    <strong className="price">{formatPrice(product.price)}</strong>
                    <a
                      className="btn"
                      href={whatsappBuyUrl(product)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {seeAllHref && (
          <p style={{ marginTop: "1.2rem" }}>
            <Link className="btn btn-ghost" href={seeAllHref}>
              Ver todo el catálogo
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
