// api/api/addProduct/route.js

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const productData = await request.json();

        // Check for required fields
        const { name, category, price, description, availableImages, stock } =
            productData;
        if (
            !name ||
            !category ||
            price === undefined ||
            !description ||
            !availableImages ||
            stock === undefined
        ) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        // Prepare the product data
        const newProduct = {
            name,
            category,
            price,
            description,
            availableColors: productData.availableColors || [],
            availableImages,
            availableSizes: productData.availableSizes || [],
            stock,
            collection: {
                winter: productData.collection?.winter || {},
                summer: productData.collection?.summer || {},
                spring: productData.collection?.spring || {},
                onsale: productData.collection?.onsale || {},
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Insert product into the database
        const result = await db.collection("products").insertOne(newProduct);

        return NextResponse.json({
            success: true,
            message: "Product added successfully!",
            productId: result.insertedId,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json(
            { error: "Failed to add product." },
            { status: 500 }
        );
    }
}
