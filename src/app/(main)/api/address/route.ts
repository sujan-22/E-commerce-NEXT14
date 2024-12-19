import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addressActionSchema = z.object({
    action: z.enum(["add", "update", "remove", "get"]),
    userId: z.string(),
    addressId: z.string().optional(),
    newAddress: z
        .object({
            addressId: z.string().optional(),
            addressName: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            address: z.string(),
            city: z.string(),
            province: z.string(),
            postalCode: z.string(),
            country: z.string(),
            phone: z.string(),
            email: z.string().email(),
        })
        .optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsedData = addressActionSchema.parse(body);

        const { action, userId, addressId, newAddress } = parsedData;

        const client = await clientPromise;
        const db = client.db();
        const addressesCollection = db.collection("Addresses");

        let updatedAddresses = [];
        const userDoc = await addressesCollection.findOne({ userId });
        switch (action) {
            case "add":
                if (!newAddress) {
                    return NextResponse.json(
                        { error: "Address details are required" },
                        { status: 400 }
                    );
                }

                const addressWithId = {
                    ...newAddress,
                    addressId: new ObjectId().toString(),
                };
                updatedAddresses = [
                    ...(userDoc?.addresses || []),
                    addressWithId,
                ];
                await addressesCollection.updateOne(
                    { userId },
                    { $set: { addresses: updatedAddresses } },
                    { upsert: true }
                );

                return NextResponse.json(newAddress);

            case "update":
                if (!addressId || !newAddress) {
                    return NextResponse.json(
                        {
                            error: "Address ID and new address details are required",
                        },
                        { status: 400 }
                    );
                }

                const updateResult = await addressesCollection.updateOne(
                    { userId, "addresses.addressId": addressId },
                    { $set: { "addresses.$": { ...newAddress, addressId } } }
                );

                if (updateResult.matchedCount === 0) {
                    return NextResponse.json(
                        { error: "Address not found or update failed" },
                        { status: 404 }
                    );
                }

                return NextResponse.json({ success: true });

            case "remove":
                if (!addressId) {
                    return NextResponse.json(
                        { error: "Address ID is required" },
                        { status: 400 }
                    );
                }

                if (!userDoc || !Array.isArray(userDoc.addresses)) {
                    return NextResponse.json(
                        { error: "No addresses found for this user" },
                        { status: 404 }
                    );
                }

                // Filter out the address to be removed
                updatedAddresses = userDoc.addresses.filter(
                    (address) => address.addressId !== addressId
                );

                const deleteResult = await addressesCollection.updateOne(
                    { userId },
                    { $set: { addresses: updatedAddresses } }
                );

                if (deleteResult.modifiedCount === 0) {
                    return NextResponse.json(
                        { error: "Address removal failed" },
                        { status: 500 }
                    );
                }

                return NextResponse.json({ success: true });

            case "get":
                if (addressId) {
                    // If addressId is provided, return the specific address
                    const userAddresses = await addressesCollection.findOne(
                        { userId, "addresses.addressId": addressId },
                        { projection: { _id: 0, "addresses.$": 1 } }
                    );

                    if (
                        !userAddresses ||
                        !userAddresses.addresses ||
                        userAddresses.addresses.length === 0
                    ) {
                        return NextResponse.json(
                            { error: "Address not found" },
                            { status: 404 }
                        );
                    }

                    return NextResponse.json(userAddresses.addresses[0]);
                } else {
                    // If no addressId is provided, return all addresses
                    const userAddresses = await addressesCollection.findOne(
                        { userId },
                        { projection: { _id: 0, addresses: 1 } }
                    );

                    if (
                        !userAddresses ||
                        !userAddresses.addresses ||
                        userAddresses.addresses.length === 0
                    ) {
                        return NextResponse.json(
                            { error: "No addresses found for this user" },
                            { status: 404 }
                        );
                    }

                    return NextResponse.json(userAddresses.addresses);
                }

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Error handling address:", error);
        return NextResponse.json(
            { error: "Failed to process address operation" },
            { status: 500 }
        );
    }
}
