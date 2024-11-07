/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon, ChevronsUpDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import useStore from "@/context/useStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductSchema } from "@/lib/validationSchema";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import ImageGallery from "@/components/ImageGallery";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
    const { categories, uploadedImageUrls } = useStore();

    const [options, setOptions] = useState({
        name: "",
        category: categories[0],
        images: uploadedImageUrls,
        price: 0,
        description: "",
        stock: 0,
        availableSizes: [],
        availableColors: [],
        collection: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOptions((prev) => ({ ...prev, [name]: value }));
    };

    const handleContinue = () => {
        try {
            const validatedData = ProductSchema.parse(options);
            console.log("Validated Product details:", validatedData);
        } catch (e) {
            console.error(e.errors);
        }
    };

    if (!categories) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="w-full flex flex-col lg:flex-row lg:items-start py-6"
            data-testid="product-container"
        >
            {/* Left Side - Image Gallery */}
            <div className="w-full lg:w-1/2 mt-7 mb-10 lg:mb-0">
                <div className="hidden md:block w-full relative">
                    <ImageGallery images={uploadedImageUrls || []} />
                </div>

                {/* Carousel for small screens */}
                {/* <div className=" relative left max-w-xs mt-4 lg:hidden">
                    <Carousel>
                        <CarouselContent>
                            {uploadedImageUrls.map((url, index) => (
                                <CarouselItem key={index}>
                                    <Product
                                        initialImage={url}
                                        size="medium"
                                        isFeatured={true}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                    </Carousel>
                </div> */}
                <div className="max-w-full md:hidden overflow-hidden px-2">
                    <Carousel
                        opts={{
                            align: "center",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="flex">
                            {uploadedImageUrls.map((file, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-full sm:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex p-6">
                                                <img
                                                    src={file}
                                                    alt=""
                                                    className="w-full"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Carousel Arrows with Responsive Positioning */}
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                    </Carousel>
                </div>
            </div>

            {/* Right Side - Product Details Form */}
            <div className="flex flex-col lg:w-1/2 lg:sticky lg:top-16 space-y-6">
                <h2 className="text-3xl font-bold mb-4">Add Product Details</h2>

                {/* Product Fields */}
                <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <Label>Product name</Label>
                        <Input
                            placeholder="Product name"
                            name="name"
                            value={options.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Product Description */}
                    <div>
                        <Label>Product description</Label>
                        <Input
                            placeholder="Product description"
                            name="description"
                            value={options.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <Label>Select a category for your product</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    {options.category}
                                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {categories.map((category) => (
                                    <DropdownMenuItem
                                        key={category}
                                        className={cn(
                                            "flex items-center text-sm gap-2",
                                            {
                                                "bg-gray-100":
                                                    options.category ===
                                                    category,
                                            }
                                        )}
                                        onClick={() =>
                                            setOptions((prev) => ({
                                                ...prev,
                                                category:
                                                    category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    category.slice(1),
                                            }))
                                        }
                                    >
                                        <CheckIcon
                                            className={cn("h-4 w-4", {
                                                "opacity-100":
                                                    category ===
                                                    options.category,
                                                "opacity-0":
                                                    category !==
                                                    options.category,
                                            })}
                                        />
                                        {category.charAt(0).toUpperCase() +
                                            category.slice(1)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Product Price */}
                    <div>
                        <Label>Price ($)</Label>
                        <Input
                            type="number"
                            name="price"
                            value={options.price}
                            onChange={handleInputChange}
                            placeholder="Enter product price"
                        />
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <Label>Stock Quantity</Label>
                        <Input
                            type="number"
                            name="stock"
                            value={options.stock}
                            onChange={handleInputChange}
                            placeholder="Enter stock quantity"
                        />
                    </div>

                    {/* Available Colors */}
                    <div>
                        <Label>Available Colors</Label>
                        <Input
                            placeholder="Enter colors separated by commas"
                            name="availableColors"
                            value={options.availableColors.join(", ")}
                            onChange={(e) =>
                                setOptions((prev) => ({
                                    ...prev,
                                    availableColors: e.target.value
                                        .split(",")
                                        .map((color) => color.trim()),
                                }))
                            }
                        />
                    </div>

                    {/* Available Sizes */}
                    <div>
                        <Label>Available Sizes</Label>
                        <Input
                            placeholder="Enter sizes separated by commas"
                            name="availableSizes"
                            value={options.availableSizes.join(", ")}
                            onChange={(e) =>
                                setOptions((prev) => ({
                                    ...prev,
                                    availableSizes: e.target.value
                                        .split(",")
                                        .map((size) => size.trim()),
                                }))
                            }
                        />
                    </div>

                    {/* Collection Dropdown */}
                    <div>
                        <Label>Select a Collection</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    {options.collection || "Choose collection"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {["Winter", "Summer", "Spring", "On Sale"].map(
                                    (collection) => (
                                        <DropdownMenuItem
                                            key={collection}
                                            className={cn(
                                                "flex items-center text-sm gap-2",
                                                {
                                                    "bg-gray-100":
                                                        options.collection ===
                                                        collection,
                                                }
                                            )}
                                            onClick={() =>
                                                setOptions((prev) => ({
                                                    ...prev,
                                                    collection,
                                                }))
                                            }
                                        >
                                            <CheckIcon
                                                className={cn("h-4 w-4", {
                                                    "opacity-100":
                                                        collection ===
                                                        options.collection,
                                                    "opacity-0":
                                                        collection !==
                                                        options.collection,
                                                })}
                                            />
                                            {collection}
                                        </DropdownMenuItem>
                                    )
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Continue Button */}
                <Button
                    isLoading={false}
                    disabled={
                        !options.name ||
                        !options.description ||
                        !options.price ||
                        options.stock < 0
                    }
                    onClick={handleContinue}
                    className="w-full mt-4"
                >
                    Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
            </div>
        </div>
    );
};

export default Page;
