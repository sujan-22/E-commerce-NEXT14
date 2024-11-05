// api/api/addProduct/route.js

import clientPromise from "@/lib/mongodb";
import { ProductSchema } from "@/lib/validationSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const productData = await request.json();

        const validation = ProductSchema.safeParse(productData);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const lastProduct = await db
            .collection("products")
            .find({})
            .sort({ id: -1 })
            .limit(1)
            .toArray();

        const newProductId = lastProduct.length > 0 ? lastProduct[0].id + 1 : 1;

        const newProduct = {
            ...validation.data,
            id: newProductId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

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
