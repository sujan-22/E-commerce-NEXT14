import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";

// Address schema validation
const addressSchema = z.object({
    userId: z.string(), // Expecting the user ID in the request
    action: z.enum(["add", "update", "get", "remove"]), // Added 'remove' action
    addressId: z.string().optional(), // Optional addressId for update/remove action
    shippingAddress: z
        .object({
            firstName: z.string(),
            lastName: z.string(),
            address: z.string(),
            postalCode: z.string(),
            city: z.string(),
            country: z.string(),
            phone: z.string().optional(),
            company: z.string().optional(),
            province: z.string(),
            email: z.string(),
        })
        .optional(), // Shipping address is optional for "get" and "remove" actions
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsedData = addressSchema.parse(body);

        const { userId, action, addressId, shippingAddress } = parsedData;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db();

        switch (action) {
            case "add":
                // Add a new address to the user's address list
                if (!shippingAddress) {
                    return NextResponse.json(
                        {
                            error: "Shipping address is required for add action",
                        },
                        { status: 400 }
                    );
                }

                // Generate a unique address ID (using ObjectId)
                const newAddressId = new ObjectId().toString();

                // Add the new address to the user's addresses array
                await db.collection("users").updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $push: {
                            addresses: {
                                ...shippingAddress,
                                _id: newAddressId, // Add the generated addressId
                            },
                        },
                    }
                );

                return NextResponse.json(
                    { message: "Address added successfully!" },
                    { status: 200 }
                );

            case "update":
                if (!addressId || !shippingAddress) {
                    return NextResponse.json(
                        {
                            error: "AddressId and shipping address are required for update action",
                        },
                        { status: 400 }
                    );
                }

                // Update the existing address by addressId (keeping the existing addressId)
                const updatedUser = await db.collection("users").updateOne(
                    {
                        _id: new ObjectId(userId),
                        "addresses._id": new ObjectId(addressId),
                    },
                    {
                        $set: {
                            "addresses.$": {
                                ...shippingAddress,
                                _id: new ObjectId(addressId), // Keep the existing addressId
                            }, // Update the specific address
                        },
                    }
                );

                if (updatedUser.matchedCount === 0) {
                    return NextResponse.json(
                        { error: "Address not found" },
                        { status: 404 }
                    );
                }

                return NextResponse.json(
                    { message: "Address updated successfully!" },
                    { status: 200 }
                );

            case "get":
                // Retrieve all addresses for the user
                const user = await db.collection("users").findOne(
                    { _id: new ObjectId(userId) },
                    { projection: { addresses: 1 } } // Only returning the addresses field
                );

                if (!user) {
                    return NextResponse.json(
                        { error: "User not found" },
                        { status: 404 }
                    );
                }

                return NextResponse.json(
                    { addresses: user.addresses },
                    { status: 200 }
                );

            case "remove":
                if (!addressId) {
                    return NextResponse.json(
                        { error: "AddressId is required for remove action" },
                        { status: 400 }
                    );
                }

                // Remove the address by addressId
                const removedUser = await db.collection("users").updateOne(
                    {
                        _id: new ObjectId(userId),
                    },
                    {
                        $pull: {
                            addresses: { _id: new ObjectId(addressId) },
                        },
                    }
                );

                if (removedUser.modifiedCount === 0) {
                    return NextResponse.json(
                        { error: "Address not found or already removed" },
                        { status: 404 }
                    );
                }

                return NextResponse.json(
                    { message: "Address removed successfully!" },
                    { status: 200 }
                );

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Error processing address:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors.map((err) => err.message) },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to process address" },
            { status: 500 }
        );
    }
}
