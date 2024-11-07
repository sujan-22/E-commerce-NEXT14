import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
        ContentType: "image/jpg",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the file URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files");

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "At least one file is required." },
                { status: 400 }
            );
        }

        const uploadedFileUrls = [];

        // Process each file
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileUrl = await uploadFileToS3(buffer, file.name);
            uploadedFileUrls.push(fileUrl);
        }

        // Return a success response with all uploaded file URLs
        return NextResponse.json({
            success: true,
            fileUrls: uploadedFileUrls,
        });
    } catch (error) {
        console.error("Error uploading files:", error);

        return NextResponse.json(
            { error: "Failed to upload files.", details: error.message },
            { status: 500 }
        );
    }
}
