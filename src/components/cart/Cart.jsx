"use client";

import {
  MinusCircleIcon,
  PlusCircleIcon,
  ShoppingBag,
  ShoppingCart,
  XIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import CartItem from "./CartItem";
import useStore from "@/context/useStore";
import Image from "next/image";

const Cart = () => {
  const cartItems = useStore((state) => state.cartItems);
  const allProducts = useStore((state) => state.allProducts);

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const fee = 1;
  const cartTotal = cartItems.reduce((total, item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleAddProducts = async () => {
    try {
      const response = await fetch("/api", {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error adding products:", error);
      alert("An error occurred while adding products.");
    }
  };

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
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-[1000000] h-full">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        <div className="flex-grow flex flex-col pr-6 overflow-y-auto">
          {itemCount > 0 ? (
            <>
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul className="flex-grow overflow-auto py-4">
                  {cartItems.map((item, i) => {
                    const product = allProducts.find(
                      (p) => p.id === item.productId
                    );

                    return (
                      <li
                        key={i}
                        className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                      >
                        <div className="relative flex w-full flex-row justify-between px-1 py-4">
                          <div className="absolute z-40 -ml-1 -mt-2">
                            <button
                              type="submit"
                              aria-label="Remove cart item"
                              className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
                            >
                              <XIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
                            </button>
                          </div>
                          <div className="flex flex-row">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              <Image
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={product.name}
                                src={product.availableImages[0]}
                              />
                            </div>
                            <Link
                              href={`product/${product.id}`}
                              className="z-30 ml-2 flex flex-row space-x-4"
                            >
                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {product.name}
                                </span>
                                {/* {item
                                                                    .merchandise
                                                                    .title !==
                                                                DEFAULT_OPTION ? (
                                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                                        {
                                                                            item
                                                                                .merchandise
                                                                                .title
                                                                        }
                                                                    </p>
                                                                ) : null} */}
                              </div>
                            </Link>
                          </div>
                          <div className="flex h-16 flex-col justify-between">
                            <p className="flex justify-end space-y-2 text-right text-sm">
                              {formatPrice(
                                product.onsale
                                  ? product.onsale.newPrice
                                  : product.price
                              )}
                            </p>
                            <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700 px-2">
                              <PlusCircleIcon />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">
                                  {item.quantity}
                                </span>
                              </p>
                              <MinusCircleIcon />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                    <p>Taxes</p>
                    <p className="flex justify-end space-y-2 text-right text-sm">
                      {/* {formatPrice(
                                                product.onsale
                                                    ? product.onsale.newPrice
                                                    : product.price
                                            )} */}
                    </p>
                  </div>
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                    <p>Shipping</p>
                    <p className="text-right">Calculated at checkout</p>
                  </div>
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                    <p>Total</p>
                    <p className="flex justify-end space-y-2 text-right text-sm">
                      {/* {formatPrice(
                                                product.onsale
                                                    ? product.onsale.newPrice
                                                    : product.price
                                            )} */}
                    </p>
                  </div>
                </div>
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
              <div className="text-xl font-semibold">Your cart is empty</div>
              <SheetTrigger asChild>
                <Link
                  href="/products"
                  className={buttonVariants({
                    variant: "link",
                    size: "md",
                    className: "text-sm text-secondary-foreground",
                  })}
                >
                  Add items to your cart to checkout
                </Link>
              </SheetTrigger>
            </div>
          )}
        </div>
        {itemCount > 0 && (
          <div className=" pr-6">
            <SheetFooter>
              <SheetTrigger asChild>
                <Link
                  href="/cart"
                  onClick={handleAddProducts}
                  className={buttonVariants({
                    className: "w-full",
                  })}
                >
                  Checkout
                </Link>
              </SheetTrigger>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
