import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  return NextResponse.json(q ? await searchProducts(q.slice(0, 100), 8) : []);
}
