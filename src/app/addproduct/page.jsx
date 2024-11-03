"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

export default function Page() {
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        const previewUrls = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviewUrls(previewUrls);
    };

    const handleUpload = async () => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload files.");
            }

            const data = await response.json();
            setUploadedUrls(data.fileUrls || []);
        } catch (err) {
            setError(err.message || "An error occurred.");
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitProduct = async () => {
        const { name, category, price, description } = productDetails;

        const productData = {
            name,
            category,
            price,
            description,
            availableImages: uploadedUrls,
            stock: 50,
            collection: {
                winter: {
                    type: "Winter",
                    title: "Winter Collection",
                    description:
                        "Exclusive winter collection for cold weather.",
                },
                onsale: {
                    type: "On Sale",
                    title: "Winter Sale",
                    description: "Discounted winter items!",
                    newPrice: 79.99,
                },
            },
        };

        try {
            const response = await fetch("/api/addproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error("Failed to add product.");
            }

            // Handle successful product submission, e.g., show a success message
            alert("Product added successfully!");
        } catch (err) {
            setError(
                err.message || "An error occurred while adding the product."
            );
        }
    };

    return (
        <MaxWidthWrapper className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                Upload Your Images
            </h1>

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full max-w-md text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                    <div
                        key={index}
                        className="relative w-full h-48 border rounded-lg overflow-hidden shadow-sm"
                    >
                        <Image
                            src={url}
                            alt="Thumbnail"
                            className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
                            draggable={false}
                            quality="80"
                            fill
                        />
                    </div>
                ))}
            </div>

            <Button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:bg-blue-700 disabled:bg-gray-300"
            >
                {uploading ? "Uploading..." : "Upload Images"}
            </Button>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {uploadedUrls.length > 0 && (
                <div className="mt-6 w-full max-w-md text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Uploaded Image URLs
                    </h2>
                    <ul className="mt-4 text-sm text-blue-600 space-y-2">
                        {uploadedUrls.map((url, index) => (
                            <li key={index}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Product Details Form */}
            <div className="mt-8 w-full max-w-md">
                <h2 className="text-lg font-semibold text-gray-800">
                    Product Details
                </h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={productDetails.name}
                    onChange={handleChange}
                    className="mt-2 w-full border border-gray-300 rounded p-2"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={productDetails.category}
                    onChange={handleChange}
                    className="mt-2 w-full border border-gray-300 rounded p-2"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productDetails.price}
                    onChange={handleChange}
                    className="mt-2 w-full border border-gray-300 rounded p-2"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={productDetails.description}
                    onChange={handleChange}
                    className="mt-2 w-full border border-gray-300 rounded p-2"
                ></textarea>
                <Button
                    onClick={handleSubmitProduct}
                    disabled={uploadedUrls.length === 0}
                    className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:bg-green-700 disabled:bg-gray-300"
                >
                    Add Product
                </Button>
            </div>
        </MaxWidthWrapper>
    );
}
