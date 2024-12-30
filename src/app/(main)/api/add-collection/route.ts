// app/api/addproduct/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all collections from the database
        const collections = await prisma.collection.findMany({});

        // Return the collections as a response
        return NextResponse.json(collections, { status: 200 });
    } catch (error) {
        console.error("Error fetching collections:", error);
        return NextResponse.json(
            { error: "Failed to fetch collections" },
            { status: 500 }
        );
    }
}
