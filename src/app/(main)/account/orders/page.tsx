"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/utility/Loader";
import useUserStore from "@/context/useUserStore";
import OrderOverview from "@/components/order/order-overview";
import { getAllOrdersByUserId } from "./actions";

const Page = () => {
    const { currentUser } = useUserStore();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-orders"],
        queryFn: async () => await getAllOrdersByUserId(currentUser!.id),
        retry: true,
        retryDelay: 500,
    });

    if (isLoading) {
        return (
            <div>
                <h3 className="text-lg">Orders</h3>
                <p className="text-sm text-muted-foreground">
                    View your previous orders and their status.
                </p>

                <div className="w-full mt-24 flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader />
                        <h3 className="font-semibold text-xl">
                            Loading data...
                        </h3>
                        <p>This won&apos;t take too long!</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div>Error loading orders.</div>;
    }

    const orders = data?.orders;
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg">Orders</h3>
                <p className="text-sm text-muted-foreground">
                    View your previous orders and their status.
                </p>
            </div>

            <Separator />
            <OrderOverview orders={orders!} />
        </div>
    );
};

export default Page;
