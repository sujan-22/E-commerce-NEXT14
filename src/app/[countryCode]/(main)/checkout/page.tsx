"use client";

import CheckoutForm from "@/components/checkout/templates/CheckoutForm";
import CheckoutSummary from "@/components/checkout/templates/CheckoutSummary";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Checkout() {
    return (
        <MaxWidthWrapper>
            <div className="flex flex-col lg:flex-row justify-between gap-10 py-8">
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
