import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
});

async function deleteFileFromS3(fileKey) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
}

export async function DELETE(request) {
    try {
        // Get the file URL or key from the request body
        const { fileUrl } = await request.json();

        if (!fileUrl) {
            return NextResponse.json(
                { error: "File URL is required." },
                { status: 400 }
            );
        }

        // Extract the file key from the file URL
        const fileKey = fileUrl.split(
            `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`
        )[1];

        // Call function to delete the file from S3
        await deleteFileFromS3(fileKey);

        return NextResponse.json({
            success: true,
            message: "File deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting file:", error);

        return NextResponse.json(
            { error: "Failed to delete file.", details: error.message },
            { status: 500 }
        );
    }
}
