import { NextResponse } from "next/server";
import { fetchProductById } from "@/lib/sanity-content";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || id.length > 200) {
      return NextResponse.json(
        { error: "Product ID or slug is required" },
        { status: 400 },
      );
    }

    const product = await fetchProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
