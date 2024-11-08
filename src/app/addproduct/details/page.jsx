/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import useStore from "@/context/useStore";
import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const COLLECTION_DATA = {
    winter: {
        type: "Winter",
        title: "Winter Collection",
        description: "Cozy, warm clothing for the chilly season.",
    },
    summer: {
        type: "Summer",
        title: "Summer Collection",
        description: "Light and breezy clothes for sunny days.",
    },
    spring: {
        type: "Spring",
        title: "Spring Collection",
        description: "Fresh and colorful clothing for the new season.",
    },
    onsale: {
        type: "On Sale",
        title: "Discounted Products",
        description: "Grab these amazing deals before they're gone!",
        newPrice: null,
    },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLORS = [
    "Aqua",
    "Beige",
    "Blush",
    "Blue",
    "Brown",
    "Burgundy",
    "Charcoal",
    "Cobalt",
    "Copper",
    "Coral",
    "Cream",
    "Cyan",
    "Gold",
    "Gray",
    "Green",
    "Indigo",
    "Ivory",
    "Khaki",
    "Lavender",
    "Magenta",
    "Mint",
    "Mocha",
    "Mustard",
    "Navy",
    "Olive",
    "Peach",
    "Pink",
    "Pistachio",
    "Purple",
    "Red",
    "Rose",
    "Silver",
    "Slate",
    "Slate Blue",
    "Sky Blue",
    "Tan",
    "Teal",
    "Turquoise",
    "Wine",
    "Yellow",
];

const Page = () => {
    const { categories, uploadedImageUrls } = useStore();

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            availableImages: uploadedImageUrls,
        }));
    }, [uploadedImageUrls]);

    const [options, setOptions] = useState({
        name: "",
        category: categories[0],
        availableImages: uploadedImageUrls,
        price: 0,
        description: "",
        stock: 0,
        availableSizes: [],
        availableColors: [],
        collection: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOptions((prev) => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (selectedSizes) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            availableSizes: selectedSizes,
        }));
    };

    const handleColorChange = (selectedColors) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            availableColors: selectedColors,
        }));
    };

    const handleContinue = async () => {
        try {
            const selectedCollection = COLLECTION_DATA[options.collection];

            const productData = {
                ...options,
                collection: selectedCollection,
            };

            // Validate product data
            const validatedData = ProductSchema.parse(productData);
            console.log("Validated Product details:", validatedData);

            // Make API call to add product
            const response = await fetch("/api/addproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validatedData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Product added successfully!"); // Success toast
                console.log("Product added successfully:", data);
            } else {
                toast.error(data.error || "Error adding product."); // Error toast
                console.error("Error adding product:", data.error);
            }
        } catch (e) {
            toast.error(
                "Validation or request failed: " + (e.message || e.errors)
            ); // Error toast
            console.error(
                "Validation or request failed:",
                e.message || e.errors
            );
        }
    };

    if (!categories) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="w-full flex flex-col lg:flex-row lg:items-start pb-4 pt-10"
            data-testid="product-container"
        >
            {/* Left Side - Image Gallery */}
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                <div className="hidden md:block w-full relative">
                    <ImageGallery images={uploadedImageUrls || []} />
                </div>
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
                        <Label>Select a category for your product</Label>{" "}
                        <Select
                            variant="bordered"
                            value={options.category}
                            onValueChange={(value) =>
                                setOptions((prev) => ({
                                    ...prev,
                                    category: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}{" "}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                        <Accordion type="multiple" collapsible>
                            <AccordionItem value={"Available Colors"}>
                                <AccordionTrigger>
                                    {"Available Colors"}
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
                                    <ToggleGroup
                                        type="multiple"
                                        size="lg"
                                        variant="outline"
                                        onValueChange={(newSelection) =>
                                            handleColorChange(newSelection)
                                        }
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {COLORS.map((color) => (
                                                <ToggleGroupItem
                                                    key={color}
                                                    value={color}
                                                    aria-label={`Toggle ${color}`}
                                                    className="inline-block px-3 py-1 text-sm whitespace-nowrap border rounded-md"
                                                >
                                                    {color}
                                                </ToggleGroupItem>
                                            ))}
                                        </div>
                                    </ToggleGroup>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Available Sizes */}
                    <div>
                        <Accordion type="multiple" collapsible>
                            <AccordionItem value={"Available Colors"}>
                                <AccordionTrigger>
                                    {"Available Colors"}
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
                                    <ToggleGroup
                                        type="multiple"
                                        size="lg"
                                        variant="outline"
                                        onValueChange={(newSelection) =>
                                            handleSizeChange(newSelection)
                                        }
                                    >
                                        {" "}
                                        <div className="flex flex-wrap gap-2">
                                            {SIZES.map((size) => (
                                                <ToggleGroupItem
                                                    key={size}
                                                    value={size}
                                                    aria-label={`Toggle ${size}`}
                                                >
                                                    {size}
                                                </ToggleGroupItem>
                                            ))}
                                        </div>
                                    </ToggleGroup>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Collection Dropdown */}
                    <div>
                        <Label>Select a Collection</Label>

                        <Select
                            variant="bordered"
                            value={options.collection}
                            onValueChange={(value) => {
                                setOptions((prev) => ({
                                    ...prev,
                                    collection: value, // Store just the collection name
                                }));
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Collections</SelectLabel>
                                    {Object.keys(COLLECTION_DATA).map(
                                        (collection) => (
                                            <SelectItem
                                                key={collection}
                                                value={collection}
                                            >
                                                {
                                                    COLLECTION_DATA[collection]
                                                        .title
                                                }
                                            </SelectItem>
                                        )
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

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
            </div>
        </div>
    );
};

export default Page;
