"use client";
import { useFormatPrice } from "@/lib/utils";
import React from "react";
import CartLineImage from "@/components/cart/components/CartLineImage";
import { IOrder } from "@/components/order/order-overview";

const Items = ({ order }: { order: IOrder }) => {
    const { formatPrice } = useFormatPrice();
    return (
        <div className="space-y-4">
            {order.OrderItem.map((item) => {
                if (item) {
                    return (
                        <div
                            key={item.variantId}
                            className="flex items-center justify-between p-4 border rounded-md bg-muted"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Product Image */}
                                <div className="relative w-20 h-20 rounded-md bg-muted">
                                    <CartLineImage
                                        altText={String(item.product.id)}
                                        imageUrl={item.product.images[0]}
                                    />
                                </div>
                                {/* Product Details */}
                                <div>
                                    <div className="font-medium text-sm">
                                        {item.product.name}
                                    </div>
                                    {(item.variant.color ||
                                        item.variant.size) && (
                                        <p className="text-sm text-muted-foreground">
                                            {item.variant.color &&
                                            item.variant.size
                                                ? `${item.variant.color} / ${item.variant.size}`
                                                : item.variant.color
                                                ? item.variant.color
                                                : item.variant.size}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Price and Quantity */}
                            <div className="text-right">
                                {item.product.price !==
                                item.product.basePrice ? (
                                    <div className="flex flex-col items-end">
                                        <div className="text-muted-foreground text-sm">
                                            {item.quantity}
                                            <span className="ml-1 text-sm">
                                                X
                                            </span>
                                            <span className="ml-1 text-sm">
                                                {formatPrice(
                                                    item.product.price
                                                )}
                                            </span>
                                        </div>
                                        <div className=" text-sm">
                                            {formatPrice(
                                                item.product.price! *
                                                    item.quantity
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <div className="text-muted-foreground text-sm">
                                            {item.quantity}
                                            <span className="ml-1 text-sm">
                                                X
                                            </span>
                                            <span className="ml-1">
                                                {formatPrice(
                                                    item.product.basePrice
                                                )}
                                            </span>
                                        </div>
                                        <div className=" text-sm">
                                            {formatPrice(
                                                item.product.basePrice *
                                                    item.quantity
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default Items;
