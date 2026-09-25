"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "min(420px, 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <Link href="/">
            <img src="/logo.png" alt="Haze Puff" style={{ width: 220, margin: "0 auto" }} />
          </Link>
          <p className="hero-kicker" style={{ marginTop: "0.8rem" }}>
            Acceso administración
          </p>
        </div>
        <form className="contact" onSubmit={onSubmit}>
          <h1 className="display" style={{ fontSize: "2rem" }}>
            Iniciar sesión
          </h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            Agrega, edita u oculta productos de la tienda.
          </p>
          <label>
            <span>Usuario</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p style={{ color: "#ff8b8b", margin: 0 }}>{error}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
