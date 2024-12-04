import Image from "next/image";
import React from "react";

const CheckoutSummary = () => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">In your Cart</h2>
            <div className="p-4 rounded-md space-y-4">
                {/* Subtotal, Shipping, Taxes */}
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$199.00</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>$0.00</span>
                </div>
                <hr className="border-t" />
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>$199.00</span>
                </div>

                <div className="flex items-center gap-4 border-t pt-4">
                    <div>
                        <h3 className="font-medium">
                            Decibel Dominator Deluxe
                        </h3>
                        <p className="text-sm text-gray-600">Variant: Black</p>
                        <p className="font-bold">$199.00</p>
                    </div>
                </div>
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
