// Catálogo en Postgres (tabla products en el VPS). Solo servidor.
import { Pool } from "pg";
import { baseCategories, type Category, type Product } from "@/data/products";

const g = globalThis as unknown as { pgPool?: Pool };
const pool = g.pgPool ?? (g.pgPool = new Pool({ connectionString: process.env.DATABASE_URL }));

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function toProduct(r: Row): Product {
  const p: Product = {
    id: r.id, name: r.name, slug: r.slug, description: r.description,
    price: Number(r.price), category: r.category, subcategory: r.subcategory,
    brand: r.brand, sku: r.sku, stock: r.stock, images: r.images, specs: r.specs,
  };
  if (r.compare_price != null) p.comparePrice = Number(r.compare_price);
  if (r.featured != null) p.featured = r.featured;
  if (r.is_new != null) p.isNew = r.is_new;
  if (r.quote_only != null) p.quoteOnly = r.quote_only;
  if (r.variant_group != null) p.variantGroup = r.variant_group;
  if (r.variant_label != null) p.variantLabel = r.variant_label;
  return p;
}

async function query(where: string, params: unknown[] = [], tail = ""): Promise<Product[]> {
  const { rows } = await pool.query(
    `select * from products ${where} order by (images <> '[]'::jsonb) desc, id ${tail}`,
    params,
  );
  return rows.map(toProduct);
}

export const getAllProducts = () => query("");
export const getFeaturedProducts = () => query("where featured");

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await query("where slug = $1", [slug]))[0];
}

export const getVariants = (p: Product) =>
  p.variantGroup ? query("where variant_group = $1", [p.variantGroup]) : Promise.resolve([]);

export const getRelated = (p: Product, n = 4) =>
  query("where category = $1 and id <> $2 and variant_group is distinct from $3", [p.category, p.id, p.variantGroup ?? null])
    .then((rows) => rows
      .sort((a, b) => Number(b.subcategory === p.subcategory) - Number(a.subcategory === p.subcategory))
      .slice(0, n));

export function searchProducts(q: string, limit?: number) {
  return query(
    "where name ilike $1 or description ilike $1 or brand ilike $1 or sku ilike $1",
    [`%${q.replace(/[\\%_]/g, "\\$&")}%`],
    limit ? `limit ${Math.floor(limit)}` : "",
  );
}

export async function getCategories(): Promise<Category[]> {
  const { rows } = await pool.query("select category, count(*)::int as n from products group by category");
  const counts = new Map(rows.map((r) => [r.category as string, r.n as number]));
  return baseCategories.map((c) => ({ ...c, productCount: counts.get(c.slug) ?? 0 }));
}
