import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const PRODUCTS_BY_CATEGORY_QUERY = `
*[_type == "product" && $categoryId in categories[]._ref] | order(_createdAt desc) {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
      categoryId: id,
    });

    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch products by category', details: message },
      { status: 500 }
    );
  }
}
