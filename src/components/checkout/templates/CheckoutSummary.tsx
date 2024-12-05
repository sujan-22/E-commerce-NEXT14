"use client";
import { Separator } from "@/components/ui/separator";
import { useDeliveryStore } from "@/context/useDeliveryStore";
import useStore from "@/context/useStore";
import { useFormatPrice } from "@/lib/utils";
import React from "react";

const CheckoutSummary = () => {
    const { cartTotal } = useStore();
    const { formatPrice } = useFormatPrice();
    const { deliveyOption } = useDeliveryStore();
    const deliveryPrice = deliveyOption?.charge ?? 0.0;
    const totalPrice = cartTotal + deliveryPrice;
    return (
        <div>
            <h2 className="text-lg font-bold mb-4">In your Cart</h2>
            <div className="p-4 rounded-md space-y-4">
                {/* Subtotal, Shipping, Taxes */}
                <div className="text-md flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex text-md justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(deliveryPrice)}</span>
                </div>
                <div className="flex text-md justify-between">
                    <span>Taxes</span>
                    <span>$0.00</span>
                </div>
                <hr className="border-t" />
                <div className="flex text-md justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
                <Separator />
                <div>
                    <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Add gift card or discount code
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
