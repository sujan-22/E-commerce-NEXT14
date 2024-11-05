"use client";

import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { ArrowRight, CheckIcon, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const Page = () => {
    const { categories } = useStore();
    const [options, setOptions] = useState({
        name: "",
        category: categories[0],
        price: 0,
        description: "",
        hasSize: false,
        hasColor: false,
        availableSizes: [],
        availableColors: [],
    });

    const handleSizeChange = (size) => {
        setOptions((prev) => ({
            ...prev,
            availableSizes: prev.availableSizes.includes(size)
                ? prev.availableSizes.filter((s) => s !== size)
                : [...prev.availableSizes, size],
        }));
    };

    const handleColorChange = (color) => {
        setOptions((prev) => ({
            ...prev,
            availableColors: prev.availableColors.includes(color)
                ? prev.availableColors.filter((c) => c !== color)
                : [...prev.availableColors, color],
        }));
    };

    if (!categories) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOptions((prev) => ({ ...prev, [name]: value }));
    };

    const handleContinue = () => {
        // Add validation or processing logic here
        console.log("Product details:", options);
    };

    return (
        <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-1 ">
            <div className="relative overflow-hidden col-span-2 w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <div className="relative flex-1">
                    <div className=" px-8 pb-12 pt-8">
                        <h2 className=" tracking-tight font-bold text-3xl mb-4">
                            Add your product details
                        </h2>
                        <div className=" w-full h-px my-6" />
                        <div className="relative mt-4 flex flex-col justify-between">
                            <div className="flex flex-col gap-6">
                                {/* Product Name */}
                                <div className="relative flex flex-col gap-3 w-full">
                                    <Label>Product name</Label>
                                    <Input placeholder="Black thermal hoodie" />
                                </div>
                                {/* Product Description */}
                                <div className="relative flex flex-col gap-3 w-full">
                                    <Label>Product description</Label>
                                    <Input placeholder="lorem ispum is a great text..." />
                                </div>
                                {/* Category Dropdown */}
                                <div className="relative flex flex-col gap-3 w-full">
                                    <Label>
                                        Select a category for your product
                                    </Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between"
                                            >
                                                {options.category}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {categories.map((category) => (
                                                <DropdownMenuItem
                                                    key={category}
                                                    className={cn(
                                                        "flex text-sm gap-1 items-center cursor-default hover:bg-zinc-100",
                                                        {
                                                            "bg-zinc-100":
                                                                options.category ===
                                                                category,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        setOptions((prev) => ({
                                                            ...prev,
                                                            category:
                                                                category
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                category.slice(
                                                                    1
                                                                ), // Capitalize the display
                                                        }));
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            category ===
                                                                options.category
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        category.slice(1)}{" "}
                                                    {/* Capitalize the display */}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Product Price Input */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={options.price}
                                        onChange={handleInputChange}
                                        className="border border-zinc-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter product price"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" w-full px-8 h-16 bg-white ">
                    <div className=" h-px w-full bg-zinc-200" />
                    <div className=" w-full h-full flex justify-end items-center">
                        <div className=" w-full flex gap-6 items-center">
                            <Button
                                isLoading={false}
                                disabled={
                                    !options.name ||
                                    !options.description ||
                                    !options.price
                                }
                                loadingText="Saving"
                                onClick={handleContinue}
                                size="sm"
                                className=" w-full"
                            >
                                Continue{" "}
                                <ArrowRight className=" h-4 w-4 ml-1.5 inline" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
