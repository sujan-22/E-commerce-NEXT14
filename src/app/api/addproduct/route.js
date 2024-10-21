// app/api/addproduct/route.js
import clientPromise from "@/lib/mongodb";
import products from "@/data/products";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const client = await clientPromise;
        const db = client.db(); // Specify your database name if needed
        const result = await db
            .collection("products")
            .insertMany(products.products);

        return NextResponse.json({
            message: "Products added successfully!",
            result,
        });
    } catch (error) {
        console.error("Error adding products:", error);
        return NextResponse.json(
            { error: "Failed to add products" },
            { status: 500 }
        );
    }
}
