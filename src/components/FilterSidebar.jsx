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

const FilterSidebar = ({ mobileView }) => {
    const [selectedKeys, setSelectedKeys] = useState(new Set(["all"]));

    const filterItems = [
        { key: "all", label: "All" },
        { key: "bags", label: "Bags" },
        { key: "drinkware", label: "Drinkware" },
        { key: "electronics", label: "Electronics" },
        { key: "footwear", label: "Footwear" },
        { key: "headwear", label: "Headwear" },
        { key: "hoodies", label: "Hoodies" },
        { key: "jackets", label: "Jackets" },
        { key: "kids", label: "Kids" },
        { key: "pets", label: "Pets" },
        { key: "shirts", label: "Shirts" },
        { key: "stickers", label: "Stickers" },
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
            <ul className="space-y-2 text-gray-300">
                {filterItems.map((item) => (
                    <li key={item.key}>{item.label}</li>
                ))}
            </ul>
        </div>
    );
};

export default FilterSidebar;
