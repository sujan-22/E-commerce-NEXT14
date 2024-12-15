import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for request validation
const mergeCartSchema = z.object({
    userId: z.string(),
    localCartItems: z
        .array(
            z.object({
                productId: z.number(),
                selectedColor: z.string(),
                selectedSize: z.string(),
                quantity: z.number().min(1),
            })
        )
        .optional(),
});

// TypeScript interface for CartItem
export interface CartItem {
    productId: number;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
}

export async function POST(req: NextRequest) {
    try {
        // Parse and validate the request body
        const body = await req.json();
        const { userId, localCartItems } = mergeCartSchema.parse(body);

        // Connect to MongoDB client
        const client = await clientPromise;
        const db = client.db();

        // Fetch the user's remote cart
        const remoteCart = await db
            .collection("carts")
            .findOne({ userId: new ObjectId(userId) });

        let mergedCartItems: CartItem[];

        if (remoteCart) {
            mergedCartItems = [...remoteCart.cartItems];

            localCartItems?.forEach((localItem) => {
                const existingItem = mergedCartItems.find(
                    (remoteItem: CartItem) =>
                        remoteItem.productId === localItem.productId &&
                        remoteItem.selectedColor === localItem.selectedColor &&
                        remoteItem.selectedSize === localItem.selectedSize
                );

                if (existingItem) {
                    existingItem.quantity += localItem.quantity;
                } else {
                    mergedCartItems.push(localItem);
                }
            });
            await db.collection("carts").updateOne(
                { userId: new ObjectId(userId) },
                {
                    $set: {
                        cartItems: mergedCartItems,
                        updatedAt: new Date(),
                    },
                }
            );

            return NextResponse.json({
                message: "Cart merged successfully",
                cartItems: mergedCartItems,
            });
        } else {
            await db.collection("carts").insertOne({
                userId: new ObjectId(userId),
                cartItems: localCartItems,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return NextResponse.json({
                message: "Cart created successfully with local items",
            });
        }
    } catch (error) {
        console.error("Error merging cart:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to merge cart" },
            { status: 500 }
        );
    }
}
