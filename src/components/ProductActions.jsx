import { cn } from "@/lib/utils";
import React from "react";
import { Label } from "./ui/label";

const ProductActions = ({ options, title }) => {
    const [selectedOption, setSelectedOption] = React.useState(options[0]);

    return (
        <div className="flex flex-col gap-y-3">
            <Label className="text-sm">Select {title}</Label>
            <div className="flex flex-wrap justify-between gap-2">
                {options.map((option) => {
                    const optionValue = option.color || option; // Use color property if it exists

                    return (
                        <button
                            onClick={() => setSelectedOption(optionValue)}
                            key={optionValue}
                            className={cn(
                                "bg-gray-100 border text-sm h-10 rounded-sm p-2 flex-1",
                                {
                                    "border-primary":
                                        selectedOption === optionValue, // Highlight selected option
                                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                                        selectedOption !== optionValue,
                                }
                            )}
                        >
                            {optionValue}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductActions;
