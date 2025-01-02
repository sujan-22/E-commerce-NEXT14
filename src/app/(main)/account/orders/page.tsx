"use client";
import { Separator } from "@/components/ui/separator";
import { getAllOrders } from "../../dashboard/orders/actions";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/utility/Loader";
import useUserStore from "@/context/useUserStore";
import OrderOverview from "@/components/order/order-overview";

const Page = () => {
  const { currentUser } = useUserStore();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-orders"],
    queryFn: async () => await getAllOrders(),
    retry: true,
    retryDelay: 500,
  });

  const userOrders = orders?.requests!.filter(
    (order) => order.userId === currentUser?.id
  );

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
            <h3 className="font-semibold text-xl">Loading data...</h3>
            <p>This won&apos;t take too long!</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading orders.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg">Orders</h3>
        <p className="text-sm text-muted-foreground">
          View your previous orders and their status.
        </p>
      </div>

      <Separator />
      <OrderOverview orders={userOrders!} />
    </div>
  );
};

export default Page;
