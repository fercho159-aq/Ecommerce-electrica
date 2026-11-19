import { getAllProducts, getCategories } from "@/lib/catalog";
import ProductosClient from "./ProductosClient";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
  return <ProductosClient products={products} categories={categories} />;
}
