"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./actions";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import OrderDetails from "./components/OrderDetails";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import Items from "./components/Items";
import CheckoutSummary from "@/components/checkout/templates/CheckoutSummary";
import { Separator } from "@/components/ui/separator";

const ThankYou = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";

    const { data: order } = useQuery({
        queryKey: ["get-payment-status"],
        queryFn: async () => await getPaymentStatus({ orderId }),
        retry: true,
        retryDelay: 500,
    });

    if (order === undefined) {
        return (
            <div className=" w-full mt-24 flex justify-center">
                <div className=" flex flex-col items-center gap-2">
                    <Loader2 className=" h-8 w-8 animate-spin text-zinc-500" />
                    <h3 className=" font-semibold text-xl">
                        Loading your order...
                    </h3>
                    <p>This won&apos;t take too long!</p>
                </div>
            </div>
        );
    }

    if (order === false) {
        return (
            <div className=" w-full mt-24 flex justify-center">
                <div className=" flex flex-col items-center gap-2">
                    <Loader2 className=" h-8 w-8 animate-spin text-zinc-500" />
                    <h3 className=" font-semibold text-xl">
                        Verifying your payment...
                    </h3>
                    <p>Please wait. This might take a moment!</p>
                </div>
            </div>
        );
    }

    return (
        <MaxWidthWrapper className=" flex justify-center items-center">
            <div className="py-6 min-h-[calc(100vh-64px)]">
                <div className="flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
                    <div className="flex flex-col gap-4 max-w-4xl h-full w-full py-10">
                        <h2 className="flex flex-col gap-y-3 text-3xl mb-4">
                            <span>Thank you!</span>
                            <span>Your order was placed successfully.</span>
                        </h2>
                        <OrderDetails order={order} />
                        <h2 className="flex flex-row text-3xl">Summary</h2>
                        <Separator className=" h-[1px] shrink-0 bg-border" />
                        <Items order={order} />
                        <Separator className=" h-[1px] shrink-0 bg-border" />
                        <CheckoutSummary
                            shouldDisplaySummaryText={false}
                            shipping={3.0}
                            totalPrice={order.amount}
                            tax={10.3}
                        />
                        {/*<ShippingDetails order={order} />
                    <PaymentDetails order={order} /> */}
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default ThankYou;
