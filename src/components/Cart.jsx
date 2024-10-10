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
import { formatPrice } from "@/lib/utils";
import CartItem from "./CartItem";
import { useGlobalContext } from "@/context/GlobalContext";

const Cart = () => {
    const { cartItems, allProducts } = useGlobalContext();
    const itemCount = cartItems.reduce(
        (count, item) => count + item.quantity,
        0
    );
    const fee = 1;
    const cartTotal = cartItems.reduce((total, item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    return (
        <Sheet>
            <SheetTrigger className="group -m-2 flex items-center p-2 ">
                <ShoppingCart
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-muted-foreground z-[1000000]"
                />
                <span className=" ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {itemCount}
                </span>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-[1000000] ">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle>Cart ({itemCount})</SheetTitle>
                </SheetHeader>
                {itemCount > 0 ? (
                    <>
                        <div className="flex w-full flex-col pr-6 overflow-y-auto">
                            <ScrollArea>
                                {cartItems.map((cartItem) => {
                                    const product = allProducts.find(
                                        (p) => p.id === cartItem.productId
                                    );
                                    return product ? (
                                        <CartItem
                                            product={product}
                                            quantity={cartItem.quantity}
                                            key={cartItem.productId}
                                        />
                                    ) : null;
                                })}
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
                                    {/* <span>{formatPrice(fee)}</span> */}
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    {/* <span>{formatPrice(cartTotal + fee)}</span> */}
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
