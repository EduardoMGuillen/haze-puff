import Link from "next/link";
import {
  BRAND_TAGLINE,
  CONTACT,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_LINKS,
  SHOP,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="Haze Puff" />
          <p>{BRAND_TAGLINE}</p>
        </div>
        <div className="footer-col">
          <h4>Explora</h4>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <a href={CONTACT.phoneHref} target="_blank" rel="noreferrer">
            WhatsApp {CONTACT.phoneDisplay}
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            Instagram @{INSTAGRAM_HANDLE}
          </a>
          <a href={SHOP.mapsUrl} target="_blank" rel="noreferrer">
            {CONTACT.address}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Haze Puff · {SHOP.city}
        </span>
        <span className="footer-age">Venta solo a mayores de 18 años</span>
        <Link href="/login">Admin</Link>
      </div>
    </footer>
  );
}
