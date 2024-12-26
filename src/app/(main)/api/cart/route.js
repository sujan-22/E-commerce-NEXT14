import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define schema for cart actions
const cartActionSchema = z.object({
    action: z.enum(["get", "add", "update", "remove", "clear"]),
    userId: z.string(),
    productId: z.number().optional(),
    quantity: z.number().optional(),
    selectedColor: z.string().optional(),
    selectedSize: z.string().optional(),
});

export async function POST(req) {
    try {
        const body = await req.json();
        const parsedData = cartActionSchema.parse(body);

        const {
            action,
            userId,
            productId,
            quantity,
            selectedColor,
            selectedSize,
        } = parsedData;

        const client = await clientPromise;
        const db = client.db();

        let cart = await db.collection("carts").findOne({ userId: userId });

        if (!cart) {
            cart = {
                userId,
                cartItems: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await db.collection("carts").insertOne(cart);
        }

        let updatedCart;

        switch (action) {
            case "get":
                return NextResponse.json(cart);

            case "add":
                const existingItemIndex = cart.cartItems.findIndex(
                    (item) =>
                        item.productId === productId &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                );

                if (existingItemIndex !== -1) {
                    updatedCart = {
                        ...cart,
                        cartItems: cart.cartItems.map((item, index) =>
                            index === existingItemIndex
                                ? {
                                      ...item,
                                      quantity: item.quantity + (quantity || 1),
                                  }
                                : item
                        ),
                    };
                } else {
                    const newItem = {
                        productId,
                        quantity: quantity || 1,
                        selectedColor,
                        selectedSize,
                    };
                    updatedCart = {
                        ...cart,
                        cartItems: [...cart.cartItems, newItem],
                    };
                }
                break;

            case "update":
                updatedCart = {
                    ...cart,
                    cartItems: cart.cartItems.map((item) =>
                        item.productId === productId &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                            ? {
                                  ...item,
                                  quantity,
                              }
                            : item
                    ),
                };
                break;

            case "remove":
                updatedCart = {
                    ...cart,
                    cartItems: cart.cartItems.filter(
                        (item) =>
                            item.productId !== productId ||
                            item.selectedColor !== selectedColor ||
                            item.selectedSize !== selectedSize
                    ),
                };
                break;

            case "clear":
                updatedCart = {
                    ...cart,
                    cartItems: [],
                    updatedAt: new Date(),
                };
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        await db.collection("carts").updateOne(
            { userId: userId },
            {
                $set: {
                    cartItems: updatedCart.cartItems,
                    updatedAt: new Date(),
                },
            }
        );

        // Return the updated cart
        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error("Error managing cart:", error);
        return NextResponse.json(
            { error: "Failed to process cart operation" },
            { status: 500 }
        );
    }
}
