// app/api/sign-up/seller/route.js

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";

const sellerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req) {
    try {
        const body = await req.json();
        const parsedData = sellerSchema.parse(body);

        const { name, email, password } = parsedData;

        // Connect to the MongoDB client
        const client = await clientPromise;
        const db = client.db();

        const existingSeller = await db
            .collection("sellers")
            .findOne({ email });
        if (existingSeller) {
            return NextResponse.json(
                { error: "Seller account already exists" },
                { status: 409 }
            );
        }

        // Hash the password before storing
        const hashedPassword = await hash(password, 10);

        // Create a new seller
        const newSeller = await db.collection("sellers").insertOne({
            name,
            email,
            password: hashedPassword,
            status: "pending",
        });

        return NextResponse.json(
            {
                message:
                    "Seller account created successfully! Your request will be reviewed.",
                seller: { id: newSeller.insertedId, name, email },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering seller:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors.map((err) => err.message) },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to register seller" },
            { status: 500 }
        );
    }
}
