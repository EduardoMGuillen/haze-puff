"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { SHOP } from "@/lib/constants";

export default function ShopMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: LeafletMap | null = null;
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !ref.current || ref.current.dataset.ready === "1") return;
      ref.current.dataset.ready = "1";
      map = L.map(ref.current, { scrollWheelZoom: false }).setView(
        [SHOP.lat, SHOP.lng],
        15,
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({
        className: "hp-pin",
        html: "<span></span>",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([SHOP.lat, SHOP.lng], { icon })
        .addTo(map)
        .bindPopup("<strong>Haze Puff</strong><br/>Cofradía, Cortés");
      window.setTimeout(() => map?.invalidateSize(), 250);
    })();

    return () => {
      cancelled = true;
      map?.remove();
      if (ref.current) delete ref.current.dataset.ready;
    };
  }, []);

  return <div ref={ref} className="shop-map" />;
}
