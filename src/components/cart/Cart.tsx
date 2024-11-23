"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
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
import { formatPrice } from "@/lib/utils";
import useStore, { CartItem } from "@/context/useStore";
import { useEffect, useState } from "react";
import { calculateCartTotal } from "./utils/calculateTotal";
import { useSession } from "next-auth/react";
import CartLine from "./CartLine";

const Cart: React.FC = () => {
  const { allProducts } = useStore();
  const { data: session } = useSession();
  const cartItemsFromStore = useStore((state) => state.cartItems) as CartItem[];
  const cartTotalFromStore = useStore((state) => state.cartTotal) as number;
  const [cartItems, setCartItems] = useState<CartItem[]>(cartItemsFromStore);
  const [cartTotal, setCartTotal] = useState<number>(cartTotalFromStore);
  const [itemCount, setItemCount] = useState<number>(0);

  // Fetch cart data function with type annotations
  const fetchCartData = async (): Promise<void> => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          action: "get",
          userId: session.user.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: { cartItems: CartItem[]; cartTotal: number } =
        await res.json();

      if (data.cartItems) {
        setCartItems(data.cartItems);
        setCartTotal(data.cartTotal);
        setItemCount(
          data.cartItems.reduce((count, item) => count + item.quantity!, 0)
        );
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  useEffect(() => {
    setCartTotal(calculateCartTotal(cartItems));
    setItemCount(cartItems.reduce((count, item) => count + item.quantity!, 0));
  }, [cartItems]);

  useEffect(() => {
    if (session) {
      fetchCartData();
    } else {
      setCartItems(cartItemsFromStore);
      setCartTotal(cartTotalFromStore);
      setItemCount(
        cartItemsFromStore.reduce((count, item) => count + item.quantity!, 0)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, cartItemsFromStore, cartTotalFromStore]);

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2 ">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-primary group-hover:text-muted-foreground z-[1000000]"
        />
        <span className=" ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {itemCount}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-[1000000] h-full">
        <div className="flex-grow flex flex-col pr-6 overflow-y-auto">
          {itemCount > 0 ? (
            <>
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul className="flex-grow overflow-auto py-4">
                  {cartItems.map((item, i) => {
                    const product = allProducts.find(
                      (p) => p.id === item.productId
                    );

                    return product ? (
                      <CartLine
                        product={product}
                        quantity={item.quantity!}
                        selectedSize={item.selectedSize}
                        selectedColor={item.selectedColor}
                        key={i}
                        fetchCartData={fetchCartData}
                      />
                    ) : null;
                  })}
                </ul>
                <div className="py-4 text-md text-primary">
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                    <p>Total</p>
                    <p className="flex justify-end space-y-2 text-right text-sm">
                      {formatPrice(cartTotal)}
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
                    size: "default",
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
                  className={buttonVariants({
                    className: "w-full",
                  })}
                >
                  View Cart ({itemCount})
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
