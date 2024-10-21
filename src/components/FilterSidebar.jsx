import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import useStore from "@/context/useStore";
import { cn } from "@/lib/utils";

const FilterSidebar = ({ mobileView }) => {
    const pathName = usePathname();
    const router = useRouter();

    const currentCategory = pathName.split("/").pop();
    const [selectedCategory, setSelectedCategory] = useState(
        currentCategory || "all"
    );
    const { categories, loading } = useStore();
    const searchParams = useSearchParams(); // Get search params
    const currentSort = searchParams.get("sort"); // Get the current sort option

    const fallbackFilterItems = [{ key: "all", label: "All" }];

    const filterItems =
        categories.length > 0
            ? [
                  { key: "all", label: "All" },
                  ...categories.map((cat) => ({ key: cat, label: cat })),
              ]
            : fallbackFilterItems;

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);

        // Create new URLSearchParams object
        const params = new URLSearchParams(searchParams);

        // Retain the current sort option
        if (currentSort) {
            params.set("sort", currentSort); // Retain the current sort option
        }

        // Navigate to the new URL without redundant category query parameter
        router.push(`/products/category/${value}?${params.toString()}`);
    };

    return mobileView ? (
        <Select
            variant="bordered"
            value={selectedCategory}
            onValueChange={handleCategoryChange}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {filterItems.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label.charAt(0).toUpperCase() +
                                item.label.slice(1)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    ) : (
        <div className="pr-5 text-sm pt-20">
            <p className="font-bold mb-4">Categories</p>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-2 text-muted-foreground">
                    {filterItems.map((item) => {
                        const isActive = pathName.endsWith(item.key);
                        return (
                            <li
                                key={item.key}
                                className={cn(
                                    "cursor-pointer hover:text-primary",
                                    isActive && "text-primary font-bold"
                                )}
                                onClick={() => handleCategoryChange(item.key)}
                            >
                                {item.label.charAt(0).toUpperCase() +
                                    item.label.slice(1)}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FilterSidebar;
