"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const KEY = "hazepuff-age-ok";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readConfirmed() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export default function AgeGate() {
  const pathname = usePathname();
  const confirmed = useSyncExternalStore(subscribe, readConfirmed, () => true);
  const [choice, setChoice] = useState<"none" | "accepted" | "denied">("none");

  const exempt = pathname.startsWith("/dashboard") || pathname.startsWith("/login");
  const state =
    exempt || confirmed || choice === "accepted"
      ? "hidden"
      : choice === "denied"
        ? "denied"
        : "ask";

  useEffect(() => {
    document.body.style.overflow = state === "hidden" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  if (state === "hidden") return null;

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setChoice("accepted");
  }

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="age-card">
        <img src="/logo.png" alt="Haze Puff" className="age-logo" />
        {state === "ask" ? (
          <>
            <h2 id="age-title" className="display">
              ¿Eres mayor de 18?
            </h2>
            <p>
              Haze Puff vende productos de vapeo. Para entrar confirma que tienes
              18 años o más.
            </p>
            <div className="age-actions">
              <button type="button" className="btn" onClick={accept}>
                Sí, tengo 18+
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setChoice("denied")}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-title" className="display">
              Vuelve pronto
            </h2>
            <p>Este sitio es solo para mayores de 18 años.</p>
            <div className="age-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setChoice("none")}>
                Regresar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
