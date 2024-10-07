"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
// import CartItem from "./CartItem";
import { formatPrice } from "@/lib/utils";

const Cart = () => {
    const itemCount = 0;
    const fee = 1;
    const cartTotal = 10;

    return (
        <Sheet>
            <SheetTrigger className="group -m-2 flex items-center p-2 ">
                <ShoppingCart
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 z-[1000000]"
                />
                <span className=" ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    2
                </span>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-[1000000] ">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle>Cart (2)</SheetTitle>
                </SheetHeader>
                {itemCount > 0 ? (
                    <>
                        <div className="flex w-full flex-col pr-6">
                            <ScrollArea>
                                {/* {items.map(({ product }) => (
                                    <CartItem
                                        product={product}
                                        key={product.id}
                                    />
                                ))} */}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4 pr-6">
                            <Separator />
                            <div className="space-y-1.5 text-sm">
                                <div className="flex">
                                    <span className="flex-1">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">
                                        Transaction Fee
                                    </span>
                                    <span>{formatPrice(fee)}</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    <span>{formatPrice(cartTotal + fee)}</span>
                                </div>
                            </div>

                            <SheetFooter>
                                <SheetTrigger asChild>
                                    <Link
                                        href="/cart"
                                        className={buttonVariants({
                                            className: "w-full",
                                        })}
                                    >
                                        Continue to Checkout
                                    </Link>
                                </SheetTrigger>
                            </SheetFooter>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-1">
                        <div
                            aria-hidden="true"
                            className="relative mb-4 h-60 w-60 text-primary"
                        >
                            <ShoppingBag className="relative mb-4 h-60 w-60" />
                        </div>
                        <div className="text-xl font-semibold">
                            Your cart is empty
                        </div>
                        <SheetTrigger asChild>
                            <Link
                                href="/products"
                                className={buttonVariants({
                                    variant: "link",
                                    size: "md",
                                    className:
                                        "text-sm text-secondary-foreground",
                                })}
                            >
                                Add items to your cart to checkout
                            </Link>
                        </SheetTrigger>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Cart;
