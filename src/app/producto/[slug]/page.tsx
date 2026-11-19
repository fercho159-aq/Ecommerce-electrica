import { notFound } from "next/navigation";
import { getProductBySlug, getVariants, getRelated, getCategories } from "@/lib/catalog";
import ProductoClient from "./ProductoClient";

export const dynamic = "force-dynamic";

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [variants, related, categories] = await Promise.all([getVariants(product), getRelated(product), getCategories()]);
  return (
    <ProductoClient
      product={product}
      category={categories.find((c) => c.slug === product.category)}
      variants={variants}
      related={related}
    />
  );
}
