// app/api/addproduct/route.js
import fs from "fs";
import path from "path";
import clientPromise from "@/lib/mongodb";
import products from "@/data/products";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
});

async function uploadFileToS3(fileBuffer, fileName) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `ecommerce/${fileName}-${Date.now()}`,
        Body: fileBuffer,
        ContentType: "image/png",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the file URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
}

export async function uploadProductImages(product) {
    const uploadedImageUrls = [];
    for (const imagePath of product.availableImages) {
        // Read the file from local directory
        const fullPath = path.join(process.cwd(), "public", imagePath); // Ensure path is resolved from root
        const buffer = fs.readFileSync(fullPath); // Read image file into buffer

        const fileName = imagePath.split("/").pop(); // Extract file name from the path
        const imageUrl = await uploadFileToS3(buffer, fileName); // Upload to S3 and get URL
        uploadedImageUrls.push(imageUrl); // Store image URL
    }

    return uploadedImageUrls;
}
export async function POST() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Get the current date for createdAt and updatedAt
        const currentDate = new Date();

        // Process each product to upload images and add URLs
        const productsWithTimestamps = await Promise.all(
            products.products.map(async (product) => {
                // Upload images and get URLs
                const uploadedImageUrls = await uploadProductImages(product);

                return {
                    ...product,
                    availableImages: uploadedImageUrls,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                };
            })
        );

        const result = await db
            .collection("products")
            .insertMany(productsWithTimestamps);

        return NextResponse.json({
            message: "Products added successfully!",
            result,
        });
    } catch (error) {
        console.error("Error adding products:", error);
        return NextResponse.json(
            { error: "Failed to add products" },
            { status: 500 }
        );
    }
}
