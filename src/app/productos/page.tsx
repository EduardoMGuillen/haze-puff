import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/components/Products";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Catálogo de Haze Puff en Cofradía, Cortés.",
};

export default async function ProductosPage() {
  const products = await getProducts();
  return (
    <div className="page">
      <Header />
      <div style={{ paddingTop: "4.5rem" }}>
        <Products products={products} title="Todo el catálogo" />
      </div>
      <Footer />
    </div>
  );
}
