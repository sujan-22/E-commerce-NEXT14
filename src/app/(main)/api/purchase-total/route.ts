import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
    cartTotal: z.number().nonnegative(),
    deliveryFee: z.number().nonnegative(),
    taxRate: z.number().min(0).max(1),
});

export async function POST(req: NextRequest) {
    try {
        // Parse and validate the JSON body
        const body = await req.json();
        const { cartTotal, deliveryFee, taxRate } = payloadSchema.parse(body);

        // Calculate taxable amount
        const taxableAmount = cartTotal + deliveryFee;

        // Calculate tax amount
        const taxAmount = taxableAmount * taxRate;

        // Calculate total price
        const totalPrice = taxableAmount + taxAmount;

        // Return the result as a JSON response
        return NextResponse.json({
            success: true,
            data: {
                cartTotal,
                deliveryFee,
                taxAmount,
                totalPrice,
            },
        });
    } catch (error) {
        // Handle validation or unexpected errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
