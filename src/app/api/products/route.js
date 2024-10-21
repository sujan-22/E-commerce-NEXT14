import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const { searchParams } = new URL(request.url);
        const sort = searchParams.get("sort") || "relevance";

        let sortQuery = {};

        switch (sort) {
            case "latest":
                sortQuery = { createdAt: -1 };
                break;
            case "price_low_to_high":
                sortQuery = { price: 1 };
                break;
            case "price_high_to_low":
                sortQuery = { price: -1 };
                break;
            default:
                sortQuery = {};
        }

        const products = await db
            .collection("products")
            .find({})
            .sort(sortQuery)
            .toArray();

        return NextResponse.json({
            message: "Products fetched successfully!",
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
