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
