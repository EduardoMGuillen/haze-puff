"use client";

import { useEffect, useRef } from "react";

const VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uStir;
uniform float uScroll;
uniform float uGain;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

vec2 swirl(vec2 p, vec2 c, float strength) {
  vec2 d = p - c;
  float r = length(d);
  float ang = strength * exp(-r * r * 5.0);
  float s = sin(ang);
  float co = cos(ang);
  return c + mat2(co, -s, s, co) * d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.045;

  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  p = swirl(p, m, 0.35 + uStir * 2.0);
  p.y += uScroll * 0.00018;

  vec2 base = p * 1.15;
  vec2 q = vec2(
    fbm(base + vec2(0.0, -t * 1.6)),
    fbm(base + vec2(5.2, 1.3) - t)
  );
  vec2 r = vec2(
    fbm(base + 3.2 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(base + 3.2 * q + vec2(8.3, 2.8) - t * 0.5)
  );
  float f = fbm(base + 3.0 * r + vec2(0.0, -t * 2.4));

  float dens = smoothstep(0.26, 0.9, f);
  float wisps = smoothstep(0.55, 0.62, f) * (1.0 - smoothstep(0.62, 0.78, f));

  float side = clamp(0.5 + p.x * 0.75 + (r.x - 0.5) * 1.6, 0.0, 1.0);
  vec3 violet = vec3(0.58, 0.18, 1.0);
  vec3 blue = vec3(0.12, 0.52, 1.0);
  vec3 magenta = vec3(0.86, 0.32, 1.0);
  vec3 col = mix(violet, blue, side);
  col = mix(col, magenta, smoothstep(0.62, 0.95, r.y) * 0.45);

  vec3 c = col * (dens * 0.85 + pow(dens, 2.5) * 0.8) + col * wisps * 0.2;
  c += vec3(0.75, 0.8, 1.0) * pow(dens, 6.0) * 0.14;

  float vig = smoothstep(1.3, 0.1, length((uv - 0.5) * vec2(1.1, 1.0)));
  c *= (0.5 + 0.5 * vig) * uGain;
  c = c / (1.0 + c * 0.35);

  gl_FragColor = vec4(c, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function startWebGL(canvas: HTMLCanvasElement, reduce: boolean) {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uMouse = gl.getUniformLocation(program, "uMouse");
  const uStir = gl.getUniformLocation(program, "uStir");
  const uScroll = gl.getUniformLocation(program, "uScroll");
  const uGain = gl.getUniformLocation(program, "uGain");

  let small = false;
  let scale = 0.5;
  let width = 0;
  let height = 0;
  const target = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };
  let stir = 0;
  let raf = 0;
  let running = true;
  const start = performance.now() - Math.random() * 60000;

  function resize() {
    small = window.innerWidth <= 720;
    scale = small ? 0.38 : 0.5;
    width = Math.max(1, Math.floor(window.innerWidth * scale));
    height = Math.max(1, Math.floor(window.innerHeight * scale));
    canvas.width = width;
    canvas.height = height;
    gl!.viewport(0, 0, width, height);
    if (!target.x) {
      target.x = mouse.x = width * 0.62;
      target.y = mouse.y = height * 0.55;
    }
  }

  function onMove(event: PointerEvent) {
    const nx = event.clientX * scale;
    const ny = height - event.clientY * scale;
    stir = Math.min(1, stir + Math.hypot(nx - target.x, ny - target.y) / 140);
    target.x = nx;
    target.y = ny;
  }

  function frame(now: number) {
    mouse.x += (target.x - mouse.x) * 0.05;
    mouse.y += (target.y - mouse.y) * 0.05;
    stir *= 0.965;
    gl!.uniform2f(uRes, width, height);
    gl!.uniform1f(uTime, (now - start) / 1000);
    gl!.uniform2f(uMouse, mouse.x, mouse.y);
    gl!.uniform1f(uStir, stir);
    gl!.uniform1f(uScroll, window.scrollY);
    const past = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    gl!.uniform1f(uGain, (0.8 - past * 0.36) * (small ? 0.62 : 1));
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    if (running && !reduce) raf = requestAnimationFrame(frame);
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running && !reduce) {
      running = true;
      raf = requestAnimationFrame(frame);
    }
  }

  function onScroll() {
    if (reduce) frame(performance.now());
  }

  resize();
  frame(performance.now());
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

function startCanvas2D(canvas: HTMLCanvasElement, reduce: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const blobs = Array.from({ length: 9 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.2 + Math.random() * 0.22,
    hue: i % 3 === 0 ? 290 : i % 2 === 0 ? 270 : 210,
    phase: Math.random() * Math.PI * 2,
  }));
  let raf = 0;
  let width = 0;
  let height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function paint(time: number) {
    ctx!.fillStyle = "#050505";
    ctx!.fillRect(0, 0, width, height);
    ctx!.globalCompositeOperation = "lighter";
    for (const blob of blobs) {
      const x = (blob.x + Math.sin(time * 0.00008 + blob.phase) * 0.08) * width;
      const y =
        ((blob.y - time * 0.00002 + Math.cos(time * 0.0001 + blob.phase) * 0.05) % 1.2 + 1.2) %
          1.2 *
          height -
        0.1 * height;
      const radius = blob.r * Math.max(width, height);
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `hsla(${blob.hue}, 95%, 58%, 0.2)`);
      gradient.addColorStop(0.45, `hsla(${blob.hue}, 90%, 42%, 0.07)`);
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
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

export default function SmokeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = startWebGL(canvas, reduce) ?? startCanvas2D(canvas, reduce);
    return stop;
  }, []);

  return <canvas ref={ref} className="smoke" aria-hidden />;
}
