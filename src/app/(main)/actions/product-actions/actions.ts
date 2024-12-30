"use server";

import prisma from "@/lib/prisma";

export async function fetchProductByRouterName(routerName: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { routerName },
            include: {
                variants: true,
                collection: true,
            },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        console.error("Error fetching product by routerName:", error);
        throw new Error("Error fetching product");
    }
}

export async function fetchAllProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                variants: true,
                collection: true,
            },
        });

        return products;
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw new Error("Error fetching products");
    }
}

export async function fetchProductsByCategory(category: string) {
    try {
        const products = await prisma.product.findMany({
            where: {
                category,
            },
            include: {
                variants: true,
                collection: true,
            },
        });

        if (!products || products.length === 0) {
            throw new Error("No products found for the given category");
        }

        return products;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw new Error("Error fetching products");
    }
}
