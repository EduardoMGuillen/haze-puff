"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { INSTAGRAM_URL, NAV_LINKS } from "@/lib/constants";
import { whatsappChatUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const chat = whatsappChatUrl("Hola, quiero información de Haze Puff.");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled || open ? " scrolled" : ""}`}>
      <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
        <img src="/icon-192.png" alt="" />
        <span>
          HAZE <em>PUFF</em>
        </span>
      </Link>
      <button
        type="button"
        className={`nav-toggle${open ? " open" : ""}`}
        aria-expanded={open}
        aria-label="Menú"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav className={`nav-links${open ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <a
          className="nav-social"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram de Haze Puff"
        >
          <InstagramIcon />
        </a>
        <a className="btn btn-wa" href={chat} target="_blank" rel="noreferrer">
          <WhatsAppIcon />
          WhatsApp
        </a>
      </nav>
    </header>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"
      />
    </svg>
  );
}
