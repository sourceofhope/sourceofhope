import { NextResponse } from "next/server";
import { client } from "../../../../studio/client";

const PRODUCT_QUERY = `
*[_type == "product"] | order(_createdAt desc) {
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

export async function GET() {
  try {
    const products = await client.fetch(PRODUCT_QUERY);
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch products", details: message },
      { status: 500 },
    );
  }
}
