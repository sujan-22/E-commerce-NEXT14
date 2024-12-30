import { Order } from "@prisma/client";
import React from "react";

const OrderDetails = ({ order }: { order: Order }) => {
    const formatStatus = (str: string) => {
        const formatted = str.split("_").join(" ");

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
    };
    return (
        <div className=" text-sm">
            <p className="mt-2">
                Order date:{" "}
                <span className=" text-muted-foreground">
                    {new Date(order.createdAt).toDateString()}
                </span>
            </p>
            <p className="mt-2">
                Order Id:{" "}
                <span className=" text-muted-foreground">{order.id}</span>
            </p>
            <p className="mt-2">
                Order Number:{" "}
                <span className=" text-muted-foreground">
                    {order.orderNumber}
                </span>
            </p>
            <div className="flex items-center text-compact-small gap-x-4 mt-2">
                <>
                    <p>
                        Order status:{" "}
                        <span className="text-muted-foreground">
                            {formatStatus(order.status)}
                        </span>
                    </p>
                    <p>
                        Payment status:{" "}
                        <span className="text-muted-foreground">
                            {order.isPaid ? <>Paid</> : <>Not paid</>}
                        </span>
                    </p>
                </>
            </div>
        </div>
    );
};

export default OrderDetails;
