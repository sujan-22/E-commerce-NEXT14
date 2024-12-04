"use client";

import CheckoutForm from "@/components/checkout/templates/CheckoutForm";
import CheckoutSummary from "@/components/checkout/templates/CheckoutSummary";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import useStore from "@/context/useStore";
import { notFound } from "next/navigation";

export default function Checkout() {
    const cart = useStore((state) => state.cartItems);
    if (!cart) {
        return notFound();
    }

    return (
        <MaxWidthWrapper>
            <div className="flex flex-col lg:flex-row justify-between gap-10 p-8">
                <div className="flex-1">
                    <CheckoutForm />
                </div>
                <div className="w-full lg:w-1/3">
                    <CheckoutSummary />
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
