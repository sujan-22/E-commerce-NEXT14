import { cn } from "@/lib/utils";
import React from "react";
import { Label } from "../ui/label";

const ProductActions = ({ options, title, onSelect }) => {
    const [selectedOption, setSelectedOption] = React.useState(options[0]);
    const handleSelect = (optionValue) => {
        setSelectedOption(optionValue);
        onSelect(optionValue);
    };

    return (
        <div className="flex flex-col gap-y-3">
            <Label className="text-sm">Select {title}</Label>
            <div className="flex flex-wrap justify-between gap-2">
                {options.map((option) => {
                    return (
                        <button
                            onClick={() => handleSelect(option)}
                            key={option}
                            className={cn(
                                "bg-gray-100 border text-sm h-10 rounded-sm p-2 flex-1",
                                {
                                    "border-primary": selectedOption === option,
                                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                                        selectedOption !== option,
                                }
                            )}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductActions;
