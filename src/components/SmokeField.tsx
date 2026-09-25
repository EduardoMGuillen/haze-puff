"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  r: number;
  hue: number;
  vx: number;
  vy: number;
  phase: number;
};

export default function SmokeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blobs: Blob[] = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.22 + Math.random() * 0.2,
      hue: i % 2 === 0 ? 278 : 204,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00014,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = "100%";
      canvas!.style.height = "100%";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function paint(time: number) {
      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";
      for (const blob of blobs) {
        if (!reduce) {
          blob.x += blob.vx + Math.sin(time * 0.00015 + blob.phase) * 0.00012;
          blob.y += blob.vy + Math.cos(time * 0.00012 + blob.phase) * 0.0001;
          if (blob.x < -0.1) blob.x = 1.1;
          if (blob.x > 1.1) blob.x = -0.1;
          if (blob.y < -0.1) blob.y = 1.1;
          if (blob.y > 1.1) blob.y = -0.1;
        }
        const x = blob.x * width;
        const y = blob.y * height;
        const radius = blob.r * Math.max(width, height);
        const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `hsla(${blob.hue}, 95%, 58%, 0.22)`);
        gradient.addColorStop(0.42, `hsla(${blob.hue}, 90%, 42%, 0.08)`);
        gradient.addColorStop(1, "transparent");
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
      if (!reduce) raf = requestAnimationFrame(paint);
    }

    resize();
    paint(0);
    window.addEventListener("resize", resize);
    if (!reduce) raf = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="smoke" aria-hidden />;
}
