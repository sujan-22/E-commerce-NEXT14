/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useStore, { Product } from "@/context/useStore";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
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
import { COLORS, SIZES } from "@/data/product_details";

const ProductDetails = ({ product }: { product: Product }) => {
    const { categories } = useStore();

    const [options, setOptions] = useState<{
        name: string;
        category: string;
        availableImages: string[];
        price: number;
        stock: number;
        availableSizes: string[];
        availableColors: string[];
        collection: string | undefined;
        description: string;
    }>({
        name: product?.name || "",
        category: product?.category || "",
        availableImages: product?.availableImages || [],
        price: product?.price || 0,
        description: product?.description || "",
        stock: product?.stock || 0,
        availableSizes: product?.availableSizes || [],
        availableColors: product?.availableColors || [],
        collection:
            Object.values(product!.collection).find((coll) => coll!.title)!
                .title || "",
    });

    console.log(
        Object.values(product?.collection || {}).find((coll) => coll?.title)
            ?.title || null
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOptions((prev) => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (selectedSizes: string[]) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            availableSizes: selectedSizes,
        }));
    };

    const handleColorChange = (selectedColors: string[]) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            availableColors: selectedColors,
        }));
    };

    return (
        <div>
            <h2 className="text-2xl w-full font-semibold mt-6">
                Edit Product Details
            </h2>
            <div className="w-full flex flex-col lg:flex-row lg:items-start pt-6">
                {/* Left Side - Product Details Form */}
                <div className="flex flex-col lg:w-1/2 lg:sticky space-y-4">
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
                                // variant="bordered"
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
                                                {category
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    category.slice(1)}{" "}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Product Price */}
                        <div>
                            <Label>Price (CAD)</Label>
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
                            <Accordion type="single" collapsible>
                                <AccordionItem value={"Available Colors"}>
                                    <AccordionTrigger>
                                        {"Available Colors"}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-2">
                                        <ToggleGroup
                                            type="multiple"
                                            size="lg"
                                            variant="outline"
                                            value={product.availableColors}
                                            onValueChange={(newSelection) =>
                                                handleColorChange(newSelection)
                                            }
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                {COLORS.map((color) => (
                                                    <ToggleGroupItem
                                                        key={color.color}
                                                        value={color.color}
                                                        aria-label={`Toggle ${color.color}`}
                                                        className="inline-block px-3 py-1 text-sm whitespace-nowrap border rounded-md"
                                                    >
                                                        {color.color}
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
                            <Accordion type="single" collapsible>
                                <AccordionItem value={"Available Sizes"}>
                                    <AccordionTrigger>
                                        {"Available Sizes"}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-2">
                                        <ToggleGroup
                                            type="multiple"
                                            size="lg"
                                            variant="outline"
                                            value={product.availableSizes}
                                            onValueChange={(newSelection) =>
                                                handleSizeChange(newSelection)
                                            }
                                        >
                                            {" "}
                                            <div className="flex flex-wrap gap-2">
                                                {SIZES.map((size) => (
                                                    <ToggleGroupItem
                                                        key={size.size}
                                                        value={size.size}
                                                        aria-label={`Toggle ${size.size}`}
                                                    >
                                                        {size.size}
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

                            {/* <Select
                                value={options.collection}
                                onValueChange={(value) => {
                                    setOptions((prev) => ({
                                        ...prev,
                                        collection: value,
                                    }));
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder="Choose a collection"
                                        defaultValue={options.collection}
                                    />
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
                                                        COLLECTION_DATA[
                                                            collection
                                                        ].title
                                                    }
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select> */}

                            {/* Continue Button */}
                            <Button
                                isLoading={false}
                                disabled={
                                    !options.name ||
                                    !options.description ||
                                    !options.price ||
                                    options.stock < 0
                                }
                                className="w-full mt-4"
                            >
                                Continue &rarr;
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Right Side - Image Gallery */}
                <div className="w-full lg:w-1/2 mb-10 lg:mb-0 mt-2">
                    <div className="max-w-full overflow-hidden px-2">
                        <Carousel
                            opts={{
                                align: "center",
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="flex">
                                {product.availableImages.map((file, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-full sm:basis-1/2 lg:basis-full"
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
                            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
