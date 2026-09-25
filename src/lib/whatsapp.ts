import { BRAND, SITE_URL, WHATSAPP_NUMBER } from "./constants";

export function productPageUrl(id: string) {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}/producto/${id}`;
}

export function whatsappBuyUrl(product: {
  id: string;
  name: string;
  price?: number;
}) {
  const link = productPageUrl(product.id);
  const message = `Hola, me interesa el producto: ${product.name}

Link: ${link}

— Enviado desde ${BRAND}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappChatUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
