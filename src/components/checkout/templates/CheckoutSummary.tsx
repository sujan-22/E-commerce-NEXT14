"use client";
import { Separator } from "@/components/ui/separator";
import { useFormatPrice } from "@/lib/utils";
import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import useCartStore from "@/context/useCartStore";

const CheckoutSummary = ({
    shouldDisplayTooltip,
    cartPrice,
    tax,
    totalPrice,
    shipping,
    shouldDisplaySummaryText,
}: {
    cartPrice?: number;
    shouldDisplayTooltip?: boolean;
    tax: number;
    totalPrice: number;
    shipping: number;
    shouldDisplaySummaryText?: boolean;
}) => {
    const { cartTotal } = useCartStore();
    const { formatPrice } = useFormatPrice();

    return (
        <div>
            {shouldDisplaySummaryText && (
                <h2 className="text-xl mb-4 font-semibold">Summary</h2>
            )}
            <div className="space-y-4">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm">Subtotal</p>
                        {shouldDisplayTooltip && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info size={16} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            Cart total excluding shipping and
                                            taxes.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <p className="text-sm">
                        {cartPrice
                            ? formatPrice(cartPrice)
                            : formatPrice(cartTotal)}
                    </p>
                </div>

                <div className="flex justify-between">
                    <p className="text-sm">Shipping</p>
                    <p className="text-sm">{formatPrice(shipping)}</p>
                </div>

                <div className="flex justify-between">
                    <p className="text-sm">Tax</p>
                    <p className="text-sm">{formatPrice(tax)}</p>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                    <p className="text-sm">Total</p>
                    <p className="text-sm">{formatPrice(totalPrice)}</p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
