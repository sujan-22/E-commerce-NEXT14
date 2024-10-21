// app/api/addproduct/route.js
import clientPromise from "@/lib/mongodb";
import products from "@/data/products";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Get the current date for createdAt and updatedAt
        const currentDate = new Date();

        // Add createdAt and updatedAt fields to each product
        const productsWithTimestamps = products.products.map((product) => ({
            ...product,
            createdAt: currentDate,
            updatedAt: currentDate,
        }));

        const result = await db
            .collection("products")
            .insertMany(productsWithTimestamps);

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
