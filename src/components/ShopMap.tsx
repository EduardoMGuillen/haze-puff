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
    const node = ref.current;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !node || node.dataset.ready === "1") return;
      node.dataset.ready = "1";
      const wide = window.matchMedia("(min-width: 901px)").matches;
      map = L.map(node, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
      }).setView([SHOP.lat, wide ? SHOP.lng - 0.006 : SHOP.lng], 15);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({
        className: "hp-pin",
        html: '<span class="hp-pin-ring"></span><span class="hp-pin-ring d2"></span><img src="/icon-192.png" alt="" />',
        iconSize: [64, 64],
        iconAnchor: [32, 32],
        popupAnchor: [0, -30],
      });
      L.marker([SHOP.lat, SHOP.lng], { icon })
        .addTo(map)
        .bindPopup("<strong>Haze Puff</strong><br/>Cofradía, Cortés");
      map.on("click", () => map?.scrollWheelZoom.enable());
      map.on("mouseout", () => map?.scrollWheelZoom.disable());
      window.setTimeout(() => map?.invalidateSize(), 250);
    })();

    return () => {
      cancelled = true;
      map?.remove();
      if (node) delete node.dataset.ready;
    };
  }, []);

  return <div ref={ref} className="shop-map" />;
}
