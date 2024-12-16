"use client";
import CheckoutForm from "@/components/checkout/templates/CheckoutForm";
import CheckoutSummary from "@/components/checkout/templates/CheckoutSummary";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Checkout() {
    return (
        <MaxWidthWrapper>
            <div className="flex flex-col lg:flex-row justify-between gap-10 py-8">
                <ScrollArea className="w-full">
                    <div className="flex-1 max-h-[80vh]">
                        <CheckoutForm />
                    </div>
                </ScrollArea>
                <div className="w-full lg:w-1/3">
                    <CheckoutSummary shouldDisplayTaxText />
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
