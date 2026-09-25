"use client";

import type { Product } from "@/lib/types";

export const FILTER_EVENT = "hazepuff:filter";

type Tile = { category: string; count: number; image: string };

export default function CategoryTiles({ products }: { products: Product[] }) {
  const tiles: Tile[] = [];
  for (const product of products) {
    if (!product.active) continue;
    const tile = tiles.find((item) => item.category === product.category);
    if (tile) tile.count += 1;
    else tiles.push({ category: product.category, count: 1, image: product.image });
  }
  if (tiles.length === 0) return null;

  function pick(category: string) {
    window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: category }));
    document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="cat-grid">
      {tiles.map((tile, index) => (
        <button
          key={tile.category}
          type="button"
          className="cat-tile"
          data-reveal
          style={{ transitionDelay: `${index * 70}ms` }}
          onClick={() => pick(tile.category)}
        >
          <img src={tile.image} alt="" />
          <span className="cat-info">
            <strong>{tile.category}</strong>
            <small>
              {tile.count} {tile.count === 1 ? "producto" : "productos"}
            </small>
          </span>
          <span className="cat-arrow" aria-hidden>
            →
          </span>
        </button>
      ))}
    </div>
  );
}
