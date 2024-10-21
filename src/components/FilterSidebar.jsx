import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import useStore from "@/context/useStore"; // Import zustand store

const FilterSidebar = ({ mobileView }) => {
    const [selectedKeys, setSelectedKeys] = useState(new Set(["all"]));
    const { categories, loading } = useStore();
    const router = useRouter();

    const fallbackFilterItems = [{ key: "all", label: "All" }];

    const filterItems =
        categories.length > 0
            ? [
                  { key: "all", label: "All" },
                  ...categories.map((cat) => ({ key: cat, label: cat })),
              ]
            : fallbackFilterItems;

    const sanitizeCategoryName = (name) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    // Handle category change
    const handleCategoryChange = (value) => {
        setSelectedKeys(new Set([value]));
        const sanitizedCategory = sanitizeCategoryName(value); // Sanitize the category name
        router.push(`/products/category/${sanitizedCategory}`);
    };

    return mobileView ? (
        <Select
            variant="bordered"
            value={selectedKeys.size > 0 ? Array.from(selectedKeys)[0] : ""}
            onValueChange={handleCategoryChange}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Collections</SelectLabel>
                    {filterItems.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    ) : (
        <div className="pr-5 text-sm pt-20">
            <p className="font-bold mb-4">Collections</p>
            {loading ? (
                <p>Loading...</p> // Display loading state
            ) : (
                <ul className="space-y-2 text-secondary-foreground">
                    {filterItems.map((item) => (
                        <li
                            key={item.key}
                            className="cursor-pointer hover:text-primary"
                            onClick={() => handleCategoryChange(item.key)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FilterSidebar;
