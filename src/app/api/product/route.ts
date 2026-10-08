import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/sanity-content";

export async function GET() {
  try {
    return NextResponse.json(await fetchProducts());
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
