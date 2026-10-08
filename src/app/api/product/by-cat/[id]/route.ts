import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 },
      );
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products by category" },
      { status: 500 },
    );
  }
}
