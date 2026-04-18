import { NextResponse } from "next/server";
import { client } from "../../../../../studio/client";

const PRODUCT_BY_ID_QUERY = `
*[_type == "product" && (externalId == $id || slug.current == $id)][0] {
  "id": externalId,
  "slug": slug.current,
  "acf": {
    "title": title,
    "price": price,
    "shortdescription": shortDescription,
    "longdescription": longDescription,
    "impact": impact,
    "size": size
  },
  "_embedded": {
    "wp:featuredmedia": [
      {
        "alt_text": featuredMedia.altText,
        "source_url": featuredMedia.sourceUrl
      }
    ]
  }
}
`;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID or slug is required" },
        { status: 400 },
      );
    }

    // Try to parse as number for externalId lookup
    const numericId = parseInt(id, 10);

    const product = await client.fetch(PRODUCT_BY_ID_QUERY, {
      id: isNaN(numericId) ? id : numericId,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch product", details: message },
      { status: 500 },
    );
  }
}
