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
import Product from "@/components/product/Product";
import { ProductSchema } from "@/lib/validationSchema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  const { categories, uploadedImageUrls } = useStore();
  console.log(uploadedImageUrls);

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
    <div className="relative mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-10 gap-12">
      {/* Left side: Uploaded Images (smaller screen 100%) */}
      <div className="col-span-1 md:col-span-6 flex flex-col items-center">
        {/* Grid Layout for medium and larger screens */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
          {uploadedImageUrls.map((url, index) => (
            <Product
              key={index}
              initialImage={url}
              size={"square"}
              className="w-full h-auto"
            />
          ))}
        </div>

        {/* Carousel Layout for small screens */}
        <div className="sm:hidden w-full max-w-xs">
          <Carousel>
            <CarouselContent>
              {uploadedImageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <CardContent className="flex aspect-square items-center justify-center ">
                      <Product
                        key={index}
                        initialImage={url}
                        size={"medium"}
                        className="w-full h-auto"
                      />
                    </CardContent>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Right side: Product Details Form (smaller screen 100%) */}
      <div className="col-span-1 sm:col-span-2 md:col-span-4 flex flex-col">
        <h2 className="text-3xl font-bold mb-4">Add Product Details</h2>
        <div className="flex flex-col gap-6">
          {/* Product Name */}
          <div className="flex flex-col gap-3">
            <Label>Product name</Label>
            <Input
              placeholder="Product name"
              name="name"
              value={options.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Product Description */}
          <div className="flex flex-col gap-3">
            <Label>Product description</Label>
            <Input
              placeholder="Product description"
              name="description"
              value={options.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-3">
            <Label>Select a category for your product</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
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
                      { "bg-zinc-100": options.category === category }
                    )}
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        category:
                          category.charAt(0).toUpperCase() + category.slice(1),
                      }))
                    }
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        category === options.category
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Product Price */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={options.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
            />
          </div>

          {/* Stock Quantity */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              type="number"
              id="stock"
              name="stock"
              value={options.stock}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
            />
          </div>

          {/* Available Colors */}
          <div className="flex flex-col gap-3">
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
          <div className="flex flex-col gap-3">
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
          <div className="flex flex-col gap-3">
            <Label>Select a Collection</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {options.collection || "Choose collection"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Winter", "Summer", "Spring", "On Sale"].map((collection) => (
                  <DropdownMenuItem
                    key={collection}
                    className={cn(
                      "flex text-sm gap-1 items-center cursor-default hover:bg-zinc-100",
                      { "bg-zinc-100": options.collection === collection }
                    )}
                    onClick={() =>
                      setOptions((prev) => ({ ...prev, collection }))
                    }
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        collection === options.collection
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {collection}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end w-full mt-4">
          <Button
            isLoading={false}
            disabled={
              !options.name ||
              !options.description ||
              !options.price ||
              options.stock < 0
            }
            onClick={handleContinue}
            size="sm"
            className="w-full"
          >
            Continue <ArrowRight className="h-4 w-4 ml-1.5 inline" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
