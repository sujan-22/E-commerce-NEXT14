import { cn } from "@/lib/utils";
import React from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface ProductActionsProps {
    options: string[];
    title: string;
    onSelect: (selectedOption: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
    options,
    title,
    onSelect,
}) => {
    const [selectedOption, setSelectedOption] = React.useState<string>(
        options[0]
    );

    const handleSelect = (optionValue: string) => {
        setSelectedOption(optionValue);
        onSelect(optionValue);
    };

    return (
        <div className="flex flex-col gap-y-3">
            <Label className="text-sm">Select {title}</Label>
            <div className="flex flex-wrap justify-between gap-2">
                {options.map((option) => {
                    return (
                        <Button
                            onClick={() => handleSelect(option)}
                            key={option}
                            className={cn(
                                "bg-primary border text-sm h-10 rounded-sm p-2 flex-1",
                                {
                                    "border-primary bg-muted text-primary":
                                        selectedOption === option,
                                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                                        selectedOption !== option,
                                }
                            )}
                        >
                            {option}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductActions;
