import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  cartItems: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number(),
        selectedColor: z.string().optional(),
        selectedSize: z.string().optional(),
      })
    )
    .optional(),
  cartTotal: z.number().optional(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsedData = userSchema.parse(body);

    const { name, email, password, cartItems, cartTotal } = parsedData;

    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db();

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await hash(password, 10);

    // Create a new user
    const newUser = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    if (cartItems && cartTotal) {
      await db.collection("carts").insertOne({
        userId: newUser.insertedId,
        cartItems: cartItems,
        cartTotal: cartTotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        message: "User registered successfully!",
        user: { id: newUser.insertedId, name, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
