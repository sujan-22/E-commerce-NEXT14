// api/api/getCategory/route.js

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Fetch all products
        const products = await db.collection("products").find({}).toArray();

        // Extract unique categories from products and sort them alphabetically
        const categories = [
            ...new Set(products.map((product) => product.category)),
        ].sort((a, b) => a.localeCompare(b)); // Sort categories alphabetically

        return NextResponse.json({
            message: "Categories fetched successfully!",
            categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
