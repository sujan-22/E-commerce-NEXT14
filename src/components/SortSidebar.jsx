import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

const SortSidebar = ({ mobileView }) => {
    const [selectedKeys, setSelectedKeys] = useState(new Set(["relevance"]));

    const sortItems = [
        { key: "relevance", label: "Relevance" },
        { key: "trending", label: "Trending" },
        { key: "latest", label: "Latest arrivals" },
        { key: "price_low_to_high", label: "Price: Low to High" },
        { key: "price_high_to_low", label: "Price: High to Low" },
    ];

    return mobileView ? (
        <Select
            variant="bordered"
            value={selectedKeys.size > 0 ? Array.from(selectedKeys)[0] : ""}
            onValueChange={(value) => setSelectedKeys(new Set([value]))}
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
            <ul className="space-y-2 text-gray-300">
                {sortItems.map((item) => (
                    <li key={item.key}>{item.label}</li>
                ))}
            </ul>
        </div>
    );
};

export default SortSidebar;
