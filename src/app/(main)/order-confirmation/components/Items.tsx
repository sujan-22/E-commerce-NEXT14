"use client";
import { Table, TableRow, TableCell, TableBody } from "@/components/ui/table";
import useStore from "@/context/useStore";
import { useFormatPrice } from "@/lib/utils";
import { Order } from "@prisma/client";
import React from "react";
import CartLineImage from "@/components/cart/components/CartLineImage";

const Items = ({ order }: { order: Order }) => {
    const { allProducts } = useStore();
    const { formatPrice } = useFormatPrice();
    return (
        <div>
            <Table>
                <TableBody>
                    {order.cart.map((item) => {
                        const product = allProducts.find(
                            (p) => p.id === item.productId
                        );

                        if (product) {
                            return (
                                <TableRow key={item.productId}>
                                    <TableCell className="relative w-20 h-20 rounded-md bg-muted">
                                        <CartLineImage
                                            altText={String(product.id)}
                                            imageUrl={
                                                product.availableImages[0]
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {product.name}{" "}
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
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {product.collection.onsale?.newPrice ? (
                                            <div className="flex flex-col items-end">
                                                <div className="text-muted-foreground">
                                                    {item.quantity}
                                                    <span className="ml-1 text-sm">
                                                        X
                                                    </span>
                                                    <span className="ml-1">
                                                        {formatPrice(
                                                            product.collection
                                                                .onsale.newPrice
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    {formatPrice(
                                                        product.collection
                                                            .onsale.newPrice *
                                                            item.quantity
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <div className="text-muted-foreground">
                                                    {item.quantity}
                                                    <span className="ml-1 text-sm">
                                                        X
                                                    </span>
                                                    <span className="ml-1">
                                                        {formatPrice(
                                                            product.price
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-center">
                                                    {formatPrice(
                                                        product.price *
                                                            item.quantity
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        }
                        return null; // Skip rows without matching products
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default Items;
