// app/api/addproduct/route.js
import products from "@/data/products";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadProductImages } from "./api";

const collectionIds = [
    "cm5a74rp90002gas9gy0w06b3",
    "cm5a74kd30001gas9lvz46cs4",
    "cm5a74xdx0003gas97066hm00",
];

function generateRouterName(productName: string) {
    const words = productName.split(" ");
    return words.join("-").toLowerCase();
}

export async function POST() {
    try {
        const productsWithTimestamps = await Promise.all(
            products.products.map(async (product, index) => {
                // Upload images and get URLs
                const uploadedImageUrls = await uploadProductImages(product);

                // Randomly assign a collectionId to 10 products
                const randomCollectionId =
                    index < 10
                        ? collectionIds[
                              Math.floor(Math.random() * collectionIds.length)
                          ]
                        : null;

                const routerName = generateRouterName(product.name);

                // If the product is in a sale collection, apply a random discount between 5% and 50%
                let finalPrice = product.price;
                let basePrice = product.price;

                if (
                    randomCollectionId !== null &&
                    randomCollectionId === "cm5a74kd30001gas9lvz46cs4"
                ) {
                    const discountPercentage =
                        Math.random() * (0.5 - 0.05) + 0.05;
                    finalPrice = product.price * (1 - discountPercentage);
                    basePrice = product.price;
                }

                const createdProduct = await prisma.product.create({
                    data: {
                        name: product.name,
                        routerName: routerName,
                        description: product.description,
                        price: finalPrice, // Reduced price
                        basePrice: basePrice, // Original price
                        images: uploadedImageUrls,
                        collectionId: randomCollectionId,
                        userId: "MLM4j5VBVrecH_blS2Quo",
                        category: product.category,
                    },
                });

                const variantsData = [];

                if (product.availableColors && product.availableSizes) {
                    // Both color and size are available
                    variantsData.push(
                        ...product.availableColors
                            .map((color) =>
                                product.availableSizes.map((size) => ({
                                    color,
                                    size,
                                    productId: createdProduct.id,
                                    stock: Math.floor(Math.random() * 51),
                                }))
                            )
                            .flat()
                    );
                } else if (product.availableColors) {
                    // Only color is available, create variants with default size "S"
                    variantsData.push(
                        ...product.availableColors.map((color) => ({
                            color,
                            size: "S", // Default size is "S"
                            productId: createdProduct.id,
                            stock: Math.floor(Math.random() * 51),
                        }))
                    );
                } else if (product.availableSizes) {
                    // Only size is available, create variants with default color "White"
                    variantsData.push(
                        ...product.availableSizes.map((size) => ({
                            color: "White", // Default color is "White"
                            size,
                            productId: createdProduct.id,
                            stock: Math.floor(Math.random() * 51),
                        }))
                    );
                } else {
                    variantsData.push({
                        color: "White",
                        size: "S",
                        productId: createdProduct.id,
                        stock: Math.floor(Math.random() * 51),
                    });
                }

                let variants = undefined;
                if (variantsData.length > 0) {
                    variants = await prisma.variant.createMany({
                        data: variantsData,
                    });
                }

                return {
                    ...createdProduct,
                    variants,
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
