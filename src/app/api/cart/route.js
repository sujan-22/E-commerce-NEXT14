import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const cartActionSchema = z.object({
    action: z.enum(["get", "add", "update", "remove"]),
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

        // Connect to the MongoDB client
        const client = await clientPromise;
        const db = client.db();

        // Get the cart data from the database
        const cart = await db
            .collection("carts")
            .findOne({ userId: new ObjectId(userId) });

        if (!cart) {
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            );
        }

        let updatedCart;

        switch (action) {
            case "get":
                // Return the current cart data
                return NextResponse.json(cart);

            case "add":
                // Check if the item already exists in the cart
                const existingItemIndex = cart.cartItems.findIndex(
                    (item) =>
                        item.productId === productId &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                );

                if (existingItemIndex !== -1) {
                    // If item exists, update the quantity
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
                    // If item does not exist, add the new item to the cart
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
                // Remove a product from the cart
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

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        // Update the cart data in the database with the new total
        await db.collection("carts").updateOne(
            { userId: new ObjectId(userId) },
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
