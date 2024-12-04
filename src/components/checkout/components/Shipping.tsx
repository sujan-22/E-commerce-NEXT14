"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormatPrice } from "@/lib/utils";

const Shipping = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { formatPrice } = useFormatPrice();
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "delivery";

    const deliveryOptions = [
        { id: "standard", name: "FedEx Standard", charge: 2.99 },
        { id: "express", name: "FedEx Express", charge: 10.99 },
    ];

    const handleEdit = () => {
        router.push(`${pathname}?step=delivery`, { scroll: false });
    };

    const handleSubmit = () => {
        if (!selectedOption) {
            setError("Please select a delivery option.");
            return;
        }
        router.push(`${pathname}?step=payment`, { scroll: false });
    };

    const handleOptionChange = (id: string) => {
        setSelectedOption(id);
        setError(null);
    };

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Delivery</h2>
                {!isOpen && (
                    <Button variant={"link"} onClick={handleEdit}>
                        Edit
                    </Button>
                )}
            </div>
            {isOpen ? (
                <div data-testid="delivery-options-container">
                    <div className="pb-8">
                        {deliveryOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`flex items-center justify-between p-4 mb-2 border rounded-lg cursor-pointer ${
                                    selectedOption === option.id
                                        ? "border-primary"
                                        : "border-muted"
                                }`}
                                onClick={() => handleOptionChange(option.id)}
                                data-testid="delivery-option"
                            >
                                <div className="flex items-center gap-x-4">
                                    <input
                                        type="radio"
                                        id={option.id}
                                        name="delivery"
                                        checked={selectedOption === option.id}
                                        onChange={() =>
                                            handleOptionChange(option.id)
                                        }
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <Label
                                        htmlFor={option.id}
                                        className="cursor-pointer text-md"
                                    >
                                        {option.name}
                                    </Label>
                                </div>
                                <span className="text-md font-medium">
                                    {formatPrice(option.charge)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p
                            className="text-red-600 text-sm"
                            data-testid="delivery-option-error-message"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        onClick={handleSubmit}
                        disabled={!selectedOption || isLoading}
                        data-testid="submit-delivery-option-button"
                    >
                        {isLoading ? "Loading..." : "Continue to payment"}
                    </button>
                </div>
            ) : (
                <div>
                    <div className="text-md">
                        {selectedOption ? (
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    Selected Method:
                                </span>
                                <p>
                                    {
                                        deliveryOptions.find(
                                            (option) =>
                                                option.id === selectedOption
                                        )?.name
                                    }
                                </p>
                            </div>
                        ) : (
                            <p>No delivery method selected.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shipping;
