import { z } from "zod";

// Signin schema
export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

// Signup schema
export const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

// Collection Schema
export const CollectionSchema = z.object({
    type: z.enum(["Winter", "Summer", "Spring", "On Sale"]),
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    newPrice: z.number().nullable().optional(),
});

// Product schema
export const ProductSchema = z.object({
    name: z.string().nonempty("Product name is required"),
    category: z.string().nonempty("Category is required"),
    price: z.preprocess(
        (val) => parseFloat(String(val).replace(/^0+/, "")),
        z.number().positive("Price must be a positive number")
    ),
    stock: z.preprocess(
        (val) => parseInt(String(val).replace(/^0+/, ""), 10),
        z.number().positive("Stock quantity must be a positive integer")
    ),
    description: z.string().nonempty("Description is required"),
    availableSizes: z.array(z.string()).optional(),
    availableColors: z.array(z.string()).optional(),
    availableImages: z.array(z.string()).min(0, "Image is required"),
    collection: CollectionSchema.nullable(),
});
