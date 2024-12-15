import React from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import necessary hooks
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { cn } from "@/lib/utils";

const SortSidebar = ({ mobileView }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "relevance";

    const sortItems = [
        { key: "relevance", label: "Relevance" },
        { key: "latest", label: "Latest arrivals" },
        { key: "price_low_to_high", label: "Price: Low to High" },
        { key: "price_high_to_low", label: "Price: High to Low" },
    ];

    const handleSortChange = (value) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", value);
        router.push(`?${params.toString()}`);
    };

    return mobileView ? (
        <Select
            variant="bordered"
            value={currentSort}
            onValueChange={handleSortChange}
        >
            <SelectTrigger className=" w-full">
                <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    {sortItems.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    ) : (
        <div className="pl-5 text-sm pt-20">
            <p className="font-bold mb-4">Sort by</p>
            <ul className="space-y-2 text-muted-foreground">
                {sortItems.map((item) => (
                    <li
                        key={item.key}
                        className={cn(
                            "cursor-pointer hover:text-primary",
                            currentSort === item.key && "text-primary font-bold"
                        )}
                        onClick={() => handleSortChange(item.key)}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SortSidebar;
