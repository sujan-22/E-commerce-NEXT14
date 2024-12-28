"use client";
import useStore from "@/context/useStore";
import { useFormatPrice } from "@/lib/utils";
import { Order } from "@prisma/client";
import React from "react";
import CartLineImage from "@/components/cart/components/CartLineImage";

const Items = ({ order }: { order: Order }) => {
    const { allProducts } = useStore();
    const { formatPrice } = useFormatPrice();
    return (
        <div className="space-y-4">
            {" "}
            {/* Adds vertical space between rows */}
            {order.cart.map((item) => {
                const product = allProducts.find(
                    (p) => p.id === item.productId
                );

                if (product) {
                    return (
                        <div
                            key={item.productId}
                            className="flex items-center justify-between p-4 border rounded-md bg-muted"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Product Image */}
                                <div className="relative w-20 h-20 rounded-md bg-muted">
                                    <CartLineImage
                                        altText={String(product.id)}
                                        imageUrl={product.availableImages[0]}
                                    />
                                </div>
                                {/* Product Details */}
                                <div>
                                    <div className="font-medium text-sm">
                                        {product.name}
                                    </div>
                                    {(item.selectedColor ||
                                        item.selectedSize) && (
                                        <p className="text-sm text-muted-foreground">
                                            {item.selectedColor &&
                                            item.selectedSize
                                                ? `${item.selectedColor} / ${item.selectedSize}`
                                                : item.selectedColor
                                                ? item.selectedColor
                                                : item.selectedSize}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Price and Quantity */}
                            <div className="text-right">
                                {product.collection.onsale?.newPrice ? (
                                    <div className="flex flex-col items-end">
                                        <div className="text-muted-foreground text-sm">
                                            {item.quantity}
                                            <span className="ml-1 text-sm">
                                                X
                                            </span>
                                            <span className="ml-1 text-sm">
                                                {formatPrice(
                                                    product.collection.onsale
                                                        .newPrice
                                                )}
                                            </span>
                                        </div>
                                        <div className=" text-sm">
                                            {formatPrice(
                                                product.collection.onsale
                                                    .newPrice * item.quantity
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
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                        <div className=" text-sm">
                                            {formatPrice(
                                                product.price * item.quantity
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
