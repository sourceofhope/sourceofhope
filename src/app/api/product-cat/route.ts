import { NextResponse } from "next/server";
import { client } from "../../../../studio/client";

const PRODUCT_CATEGORY_QUERY = `
*[_type == "productCategory"] | order(title asc) {
  "id": _id,
  "title": title,
  "slug": slug.current,
  "description": description
}
`;

export async function GET() {
  try {
    const categories = await client.fetch(PRODUCT_CATEGORY_QUERY);
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch product categories", details: message },
      { status: 500 },
    );
  }
}
