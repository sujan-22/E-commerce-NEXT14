import { Order } from "@prisma/client";
import React from "react";

const OrderDetails = ({ order }: { order: Order }) => {
    const formatStatus = (str: string) => {
        const formatted = str.split("_").join(" ");

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
    };
    return (
        <div>
            <p className="mt-2">
                Order date:{" "}
                <span>{new Date(order.createdAt).toDateString()}</span>
            </p>
            <p className="mt-2">
                Order Id: <span>{order.id}</span>
            </p>
            <div className="flex items-center text-compact-small gap-x-4 mt-4">
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
