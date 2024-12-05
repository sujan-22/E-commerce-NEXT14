import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { IAddress } from "@/data/types/address";

const addressActionSchema = z.object({
    action: z.enum(["add", "update", "remove", "get"]),
    userId: z.string(),
    addressId: z.string().optional(),
    newAddress: z
        .object({
            addressName: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            address: z.string(),
            city: z.string(),
            province: z.string(),
            postalCode: z.string(),
            country: z.string(),
            phone: z.string(),
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

        const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        let updatedAddresses;
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
                    addressId: new ObjectId(),
                };
                updatedAddresses = [...(user.addresses || []), addressWithId];

                await db
                    .collection("users")
                    .updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { addresses: updatedAddresses } }
                    );

                return NextResponse.json(addressWithId);

            case "update":
                if (!addressId || !newAddress) {
                    return NextResponse.json(
                        {
                            error: "Address ID and new address details are required",
                        },
                        { status: 400 }
                    );
                }

                updatedAddresses = (user.addresses || []).map(
                    (addr: IAddress) =>
                        addr.addressId?.toString() === addressId
                            ? { ...addr, ...newAddress }
                            : addr
                );

                await db
                    .collection("users")
                    .updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { addresses: updatedAddresses } }
                    );

                return NextResponse.json({ success: true });

            case "remove":
                if (!addressId) {
                    return NextResponse.json(
                        { error: "Address ID is required" },
                        { status: 400 }
                    );
                }

                updatedAddresses = (user.addresses || []).filter(
                    (addr: IAddress) => addr.addressId?.toString() !== addressId
                );

                await db
                    .collection("users")
                    .updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { addresses: updatedAddresses } }
                    );

                return NextResponse.json({ success: true });

            case "get":
                if (!addressId) {
                    return NextResponse.json(user.addresses || []);
                }

                const address = (user.addresses || []).find(
                    (addr: IAddress) => addr.addressId?.toString() === addressId
                );

                if (!address) {
                    return NextResponse.json(
                        { error: "Address not found" },
                        { status: 404 }
                    );
                }

                return NextResponse.json(address);

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
