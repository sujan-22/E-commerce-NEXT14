"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormatPrice } from "@/lib/utils";
import { useDeliveryStore } from "@/context/useDeliveryStore";
import { IoCheckmarkCircle } from "react-icons/io5";

export interface IDeliveyOptions {
    id: string;
    name: string;
    charge: number;
    description: string;
}

const Shipping = () => {
    // const [isLoading, setIsLoading] = useState(false);
    const { deliveryOption, setDeliveryOption } = useDeliveryStore();
    const { formatPrice } = useFormatPrice();
    const [error, setError] = useState<string | null>(null);
    console.log("deliveryOption", deliveryOption);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "delivery";

    const deliveryOptions: IDeliveyOptions[] = [
        {
            id: "standard",
            name: "FedEx Standard",
            charge: 2.99,
            description:
                "Standard delivery with an estimated 5-7 business days.",
        },
        {
            id: "express",
            name: "FedEx Express",
            charge: 10.99,
            description: "Fast and reliable delivery in 1-2 business days.",
        },
    ];

    const handleEdit = () => {
        setDeliveryOption(null);
        router.push(`${pathname}?step=delivery`, { scroll: false });
    };

    const handleSubmit = () => {
        if (!deliveryOption) {
            setError("Please select a delivery option.");
            return;
        }
        router.push(`${pathname}?step=review`, { scroll: false });
    };

    const handleOptionChange = (option: IDeliveyOptions) => {
        setDeliveryOption(option);
        setError(null);
    };

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-2">
                <h2
                    className={`text-lg font-semibold flex items-center ${
                        !isOpen ? "text-muted-foreground" : ""
                    }`}
                >
                    Shipping Method
                    {deliveryOption && (
                        <IoCheckmarkCircle className="ml-2 w-4 h-4" />
                    )}
                </h2>
                {!isOpen && deliveryOption && (
                    <Button
                        variant={"link"}
                        className="text-blue-600"
                        onClick={handleEdit}
                    >
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
                                    deliveryOption?.id === option.id
                                        ? "border-primary"
                                        : "border-muted"
                                }`}
                                onClick={() => handleOptionChange(option)}
                            >
                                <div className="flex items-center gap-x-4">
                                    <input
                                        type="radio"
                                        id={option.id}
                                        name="delivery"
                                        checked={
                                            deliveryOption?.id === option.id
                                        }
                                        onChange={() =>
                                            handleOptionChange(option)
                                        }
                                        className="w-4 h-4 cursor-pointer text-primary"
                                    />
                                    <Label
                                        htmlFor={option.id}
                                        className="cursor-pointer text-sm"
                                    >
                                        {option.name}{" "}
                                        <span className="text-sm text-muted-foreground">
                                            ({option.description})
                                        </span>
                                    </Label>
                                </div>
                                <span className="text-sm font-medium">
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

                    <Button onClick={handleSubmit}>Continue to Review</Button>
                </div>
            ) : (
                deliveryOption && (
                    <div>
                        <div className="text-sm">
                            <div className="flex flex-col">
                                <div className="p-4 border border-gray-400 rounded-lg shadow-sm">
                                    <p className="text-sm font-semibold">
                                        {deliveryOption.name}{" "}
                                        <span className="text-muted-foreground">
                                            (
                                            {formatPrice(deliveryOption.charge)}
                                            )
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Shipping;
