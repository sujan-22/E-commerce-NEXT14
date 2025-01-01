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

export async function fetchProductsByCategory(
    category: string,
    related?: boolean,
    id?: string
) {
    try {
        const products = await prisma.product.findMany({
            where: {
                category,
                ...(related && { id: { not: id } }),
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

export async function getProductSeller(routerName: string) {
    try {
        // Fetch the product along with its user
        const product = await prisma.product.findUnique({
            where: { routerName },
            include: {
                user: true,
            },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        if (!product.user) {
            throw new Error("Seller (user) not found for this product");
        }

        return product.user;
    } catch (error) {
        console.error("Error fetching product seller:", error);
        throw new Error("Error fetching product seller");
    }
}

export async function getVariantById(variantId: string) {
    try {
        // Fetch the variant by ID
        const variant = await prisma.variant.findUnique({
            where: {
                id: variantId,
            },
            include: {
                product: true,
            },
        });

        if (!variant) {
            throw new Error(`Variant with ID ${variantId} not found.`);
        }

        return variant;
    } catch (error) {
        console.error("Error fetching variant:", error);
        throw new Error("Failed to retrieve variant. Please try again later.");
    }
}
