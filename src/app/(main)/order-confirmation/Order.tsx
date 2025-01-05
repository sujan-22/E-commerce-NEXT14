"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./actions";
import { useSearchParams } from "next/navigation";
import OrderDetails from "./components/OrderDetails";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import Items from "./components/Items";
import CheckoutSummary from "@/components/checkout/templates/CheckoutSummary";
import { Separator } from "@/components/ui/separator";
import ShippingDetails from "./components/ShippingDetails";
import Loader from "@/components/utility/Loader";

const Order = ({ isOrderDetailsPage }: { isOrderDetailsPage?: boolean }) => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";

    const { data: order } = useQuery({
        queryKey: ["get-payment-status"],
        queryFn: async () => await getPaymentStatus({ orderId }),
        retry: 2,
        retryOnMount: true,
    });

    if (order === undefined) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <h3 className="font-semibold text-xl">
                        Fetching your order details...
                    </h3>
                    <p>This won&apos;t take too long!</p>
                </div>
            </div>
        );
    }

    if (order === false) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <h3 className="font-semibold text-xl">
                        Verifying your payment...
                    </h3>
                    <p>Please wait. This might take a moment!</p>
                </div>
            </div>
        );
    }

    const tax = +(order.amount * 0.13).toFixed(2);

    return (
        <MaxWidthWrapper className="flex justify-center">
            <div className="py-6 min-h-[calc(100vh-64px)] w-full max-w-3xl mx-auto">
                <div className="flex flex-col justify-center items-center gap-y-10 w-full">
                    <div className="flex flex-col gap-4 w-full lg:py-10">
                        <h2 className="flex flex-col gap-y-3 lg:mb-4">
                            {!isOrderDetailsPage ? (
                                <>
                                    <span className="text-xl">Thank you!</span>
                                    <span className="text-lg">
                                        Your order was placed successfully.
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl">Order Details</span>
                            )}
                        </h2>
                        <OrderDetails order={order} />
                        <h2 className="flex flex-row text-xl">Summary</h2>
                        <Items order={order} />
                        <Separator className="h-[1px] shrink-0 bg-border" />
                        <CheckoutSummary
                            shouldDisplaySummaryText={false}
                            shipping={3.0}
                            totalPrice={order.amount}
                            tax={tax}
                            cartPrice={order.cartAmount}
                        />
                        <ShippingDetails order={order} />
                        {/*  <PaymentDetails order={order} /> */}
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default Order;
