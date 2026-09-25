import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const items = products
    .filter((product) => product.active)
    .map((product) => ({
      url: `${SITE_URL}/producto/${product.id}`,
      lastModified: product.createdAt,
    }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/productos`, lastModified: new Date() },
    ...items,
  ];
}
