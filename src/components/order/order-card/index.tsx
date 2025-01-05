"use client";
import { Button } from "@/components/ui/button";
import { useFormatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import CartLineImage from "@/components/cart/components/CartLineImage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IOrder } from "../order-overview";

const OrderCard = ({ order }: { order: IOrder }) => {
    const { formatPrice } = useFormatPrice();
    const router = useRouter();
    const numberOfLines = useMemo(() => {
        return (
            order.OrderItem?.reduce((acc, item) => {
                return acc + item.quantity;
            }, 0) ?? 0
        );
    }, [order]);

    const numberOfProducts = useMemo(() => {
        return order.OrderItem.length ?? 0;
    }, [order]);

    return (
        <div className="flex flex-col text-sm" data-testid="order-card">
            <div className="mb-1 font-semibold">
                #<span>{order.orderNumber}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
                <span data-testid="order-created-at">
                    {new Date(order.createdAt).toDateString()}
                </span>
                <span className="px-1" data-testid="order-amount">
                    &nbsp;|&nbsp;
                    <span className="px-1">{formatPrice(order.amount)}</span>
                    &nbsp;|&nbsp;
                </span>
                <span>{`${numberOfLines} ${
                    numberOfLines > 1 ? "items" : "item"
                }`}</span>
            </div>
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex small:grid-cols-4 gap-4 my-4">
                    {order.OrderItem.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex flex-col">
                            {item.product.images && (
                                <div className="relative w-44 h-44 rounded-md bg-muted">
                                    <CartLineImage
                                        altText={String(item.id)}
                                        imageUrl={item.product.images[0]}
                                    />
                                </div>
                            )}
                            <div className="flex justify-between text-muted-foreground mt-2">
                                <span>{item.product.name}</span>
                                <span>X {item.quantity}</span>
                            </div>
                        </div>
                    ))}
                    {numberOfProducts > 4 && (
                        <div className="w-full h-full flex flex-col items-center justify-center m-auto">
                            <span>+ {numberOfLines - 4}</span>
                            <span>more</span>
                        </div>
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="flex justify-end mb-3">
                <Button
                    variant="secondary"
                    onClick={() =>
                        router.push(`/order-details?orderId=${order.id}`)
                    }
                >
                    See details
                </Button>
            </div>
        </div>
    );
};

export default OrderCard;
