"use server";

import clientPromise from "@/lib/mongodb";

export const removeImageFromProduct = async ({
    productId,
    imageUrl,
}: {
    productId: number;
    imageUrl: string;
}) => {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Find the product by ID
        const product = await db
            .collection("products")
            .findOne({ id: productId });

        console.log(imageUrl);

        if (!product) {
            return {
                success: false,
                message: "Product not found.",
            };
        }

        const updatedImages = product.availableImages.filter(
            (image: string) => image !== imageUrl
        );

        const result = await db
            .collection("products")
            .updateOne(
                { id: productId },
                { $set: { availableImages: updatedImages } }
            );

        if (result.modifiedCount === 0) {
            return {
                success: false,
                message: "Failed to update the product. No changes were made.",
            };
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/delete-image`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileUrl: imageUrl,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: true,
                message:
                    "Image removed from the database, but failed to remove from S3 storage: " +
                    (data.message || "Unknown error"),
            };
        }

        return {
            success: true,
            message:
                "Image removed successfully from both the database and S3 storage.",
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.",
        };
    }
};

export const addImagesToProduct = async ({
    productId,
    formData,
}: {
    productId: number;
    formData: FormData;
}) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to upload files.");
        }

        const data = await response.json();
        const uploadedImageUrls: string[] = data.fileUrls;

        if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
            throw new Error("No image URLs returned from the upload API.");
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db
            .collection("products")
            .updateOne(
                { id: productId },
                { $addToSet: { availableImages: { $each: uploadedImageUrls } } }
            );

        if (result.modifiedCount === 0) {
            return {
                success: false,
                message: "Failed to update the product. No changes were made.",
            };
        }

        return {
            success: true,
            message: "Images added successfully to the product.",
            uploadedImageUrls,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.",
        };
    }
};
