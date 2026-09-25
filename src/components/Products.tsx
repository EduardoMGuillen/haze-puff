"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { whatsappBuyUrl } from "@/lib/whatsapp";
import { FILTER_EVENT } from "@/components/CategoryTiles";
import WhatsAppIcon from "@/components/WhatsAppIcon";

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

  useEffect(() => {
    function onFilter(event: Event) {
      const category = (event as CustomEvent<string>).detail;
      if (typeof category === "string") setFilter(category);
    }
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);

  const active = useMemo(() => products.filter((item) => item.active), [products]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of active) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "es"));
  }, [active]);

  const visible = useMemo(() => {
    const list = active.filter((item) => filter === "all" || item.category === filter);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [active, filter, limit]);

  return (
    <section className="section" id="tienda">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="section-kicker">Catálogo</p>
            <h2 className="display">{title}</h2>
          </div>
          <p className="lede">
            Precios de referencia en lempiras. El stock cambia: confirma por
            WhatsApp antes de pasar.
          </p>
        </div>
        <div className="filters" role="tablist" aria-label="Categorías">
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todos <span>{active.length}</span>
          </button>
          {categories.map(([category, count]) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={filter === category}
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category} <span>{count}</span>
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <div className="empty">Todavía no hay productos en esta categoría.</div>
        ) : (
          <div className="product-grid">
            {visible.map((product, index) => (
              <article
                key={`${filter}-${product.id}`}
                className="product-card"
                data-reveal
                style={{ transitionDelay: `${(index % 3) * 80}ms` }}
              >
                <Link href={`/producto/${product.id}`} className="product-media">
                  {product.promo && <span className="badge">Promo</span>}
                  <img src={product.image} alt={product.name} loading="lazy" />
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
                      className="btn btn-buy"
                      href={whatsappBuyUrl(product)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon />
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
