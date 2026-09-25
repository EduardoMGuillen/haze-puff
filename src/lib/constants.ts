export const BRAND = "Haze Puff";
export const BRAND_TAGLINE = "Vapes · Good vibes · Better days";
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "50488445272";

function toOrigin(url: string) {
  try {
    return new URL(url.includes("://") ? url : `https://${url}`).origin;
  } catch {
    return url.replace(/\/$/, "");
  }
}

function resolveSiteUrl() {
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || "")
    .trim()
    .replace(/\/$/, "");
  const onVercel = process.env.VERCEL === "1";
  const isLocalhost = !explicit || /localhost|127\.0\.0\.1/i.test(explicit);

  if (explicit && !(onVercel && isLocalhost)) {
    return toOrigin(explicit);
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) {
    return toOrigin(`https://${vercelProd.replace(/^https?:\/\//, "")}`);
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return toOrigin(`https://${vercelUrl.replace(/^https?:\/\//, "")}`);
  }

  return toOrigin(explicit || "http://localhost:3000");
}

export const SITE_URL = resolveSiteUrl();
export const AUTH_COOKIE = "hazepuff_session";

export const INSTAGRAM_URL = "https://www.instagram.com/h4zepuff/";
export const INSTAGRAM_HANDLE = "h4zepuff";

export const SHOP = {
  lat: 15.40967,
  lng: -88.15498,
  city: "Cofradía, Cortés",
  country: "Honduras",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=15.40967,-88.15498",
  wazeUrl: "https://waze.com/ul?ll=15.40967,-88.15498&navigate=yes",
};

export const CONTACT = {
  phoneDisplay: "+504 8844-5272",
  phoneHref: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagram: INSTAGRAM_URL,
  address: "Cofradía, Cortés, Honduras",
};

export const NAV_LINKS = [
  { href: "/#tienda", label: "Tienda" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/#contacto", label: "Contacto" },
] as const;
