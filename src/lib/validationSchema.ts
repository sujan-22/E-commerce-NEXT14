import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export const CollectionSchema = z.object({
    type: z.enum(["Winter", "Summer", "Spring", "On Sale"]),
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    newPrice: z.number().nullable().optional(),
});

// Product schema
export const ProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    description: z.string().min(1, { message: "Description is required" }),
    availableColors: z.array(z.string()).default([]),
    availableImages: z.array(z.string()).default([]),
    availableSizes: z.array(z.string()).default([]),
    stock: z.number().int().min(0, { message: "Stock must be zero or more" }),
    collection: z.object({
        winter: CollectionSchema.extend({
            type: z.literal("Winter").default("Winter"),
        }).optional(),
        summer: CollectionSchema.extend({
            type: z.literal("Summer").default("Summer"),
        }).optional(),
        spring: CollectionSchema.extend({
            type: z.literal("Spring").default("Spring"),
        }).optional(),
        onsale: CollectionSchema.extend({
            type: z.literal("On Sale").default("On Sale"),
            newPrice: z.number().nullable().optional(),
        }).optional(),
    }),
});
