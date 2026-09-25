import Link from "next/link";
import { CONTACT, INSTAGRAM_HANDLE, INSTAGRAM_URL, SHOP } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        © {new Date().getFullYear()} Haze Puff · {SHOP.city}
        <div>Venta solo a mayores de 18 años</div>
      </div>
      <div className="footer-social">
        <a className="social-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          @{INSTAGRAM_HANDLE}
        </a>
        <a className="social-link" href={CONTACT.phoneHref} target="_blank" rel="noreferrer">
          {CONTACT.phoneDisplay}
        </a>
        <Link href="/login">Admin</Link>
      </div>
    </footer>
  );
}
