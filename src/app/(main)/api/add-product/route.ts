// app/api/addproduct/route.js
import products from "@/data/products";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadProductImages } from "./api";

function generateRouterName(productName: string) {
    const words = productName.split(" ");
    return words.join("-").toLowerCase();
}

interface Product {
    productId: string;
    availableColors: string[];
    availableSizes: string[];
}

function generateVariants(product: Product) {
    const variants: {
        productId: string;
        color: string;
        size: string;
        stock: number;
    }[] = [];
    let zeroStockCount = 0;

    product.availableColors.forEach((color: string) => {
        product.availableSizes.forEach((size: string) => {
            let stock = Math.floor(Math.random() * 51); // Random stock between 0-50
            if (zeroStockCount % 5 === 0) stock = 0; // Every 5th variant has stock 0
            zeroStockCount++;

            variants.push({
                productId: product.productId,
                color,
                size,
                stock,
            });
        });
    });

    return variants;
}

export async function POST() {
    try {
        const productsWithTimestamps = await Promise.all(
            products.products.map(async (product) => {
                // Upload images and get URLs
                const uploadedImageUrls = await uploadProductImages(product);

                const routerName = generateRouterName(product.name);

                let userId = "";
                if (product.user === "margaret") {
                    userId = "DyjdZJjzd229OOzukdPZ5";
                } else if (product.user === "olivia") {
                    userId = "hH0jge9FkayMamKJXCd-j";
                } else if (product.user === "michael") {
                    userId = "3KvEpvF8N9E8hOpYkpdBH";
                } else if (product.user === "thomas") {
                    userId = "xiDuKK8A4I4CrvR4ry9i8";
                } else if (product.user === "alex") {
                    userId = "X76lMeZcPocyBZfKMbSwU";
                } else if (product.user === "david") {
                    userId = "tI-uytDI5S8Yz_3-h_pya";
                } else if (product.user === "jay") {
                    userId = "4UKqZgKjiSghxzqQkQP8K";
                } else if (product.user === "sujan") {
                    userId = "MLM4j5VBVrecH_blS2Quo";
                }

                let collection = null;
                if (product.collection === "sale") {
                    collection = "cm5a74kd30001gas9lvz46cs4";
                } else if (product.collection === "new") {
                    collection = "cm5a74rp90002gas9gy0w06b3";
                } else if (product.collection === "week") {
                    collection = "cm5a74xdx0003gas97066hm00";
                }

                const createdProduct = await prisma.product.create({
                    data: {
                        name: product.name,
                        routerName: routerName,
                        description: product.description,
                        price: product.price, // Reduced price
                        basePrice: product.basePrice, // Original price
                        images: uploadedImageUrls,
                        collectionId: collection,
                        userId: userId,
                        category: product.category,
                    },
                });

                const variants = generateVariants({
                    ...product,
                    productId: createdProduct.id,
                });
                await prisma.variant.createMany({
                    data: variants,
                });

                return {
                    ...createdProduct,
                };
            })
        );

        return NextResponse.json({
            message: "Products added successfully!",
            result: productsWithTimestamps,
        });
    } catch (error) {
        console.error("Error adding products:", error);
        return NextResponse.json(
            { error: "Failed to add products" },
            { status: 500 }
        );
    }
}
