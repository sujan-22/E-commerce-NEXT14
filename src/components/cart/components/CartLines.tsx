"use client";

import { cn } from "@nextui-org/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";
import { useFormatPrice } from "@/lib/utils";
import useCartStore, { ICartItem } from "@/context/useCartStore";
import useUserStore from "@/context/useUserStore";
import CartLineImage from "./CartLineImage";
import { useState, useEffect } from "react";
import CartLine from "../CartLine";

const CartLines = () => {
  const { formatPrice } = useFormatPrice();
  const { currentUser } = useUserStore();
  const { guestCart, cart, removeFromCart, handleItemQuantity } =
    useCartStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemove = (item: ICartItem) => {
    removeFromCart(
      currentUser,
      item.product.id,
      item.variantId,
      item.color,
      item.size,
      item.product
    );
  };

  const handleIncrease = async (item: ICartItem) => {
    handleItemQuantity(
      currentUser,
      item.product.id,
      item.variantId,
      "increment",
      item.color,
      item.size,
      item.product
    );
  };

  const handleDecrease = async (item: ICartItem) => {
    handleItemQuantity(
      currentUser,
      item.product.id,
      item.variantId,
      "decrement",
      item.color,
      item.size,
      item.product
    );
  };

  const normalizedCart =
    guestCart.length > 0
      ? guestCart.map((item) => ({
          ...item,
          id: item.variantId,
        }))
      : cart?.items;

  return isMobile && normalizedCart!.length > 0 ? (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {normalizedCart &&
        normalizedCart.map((item) => {
          if (item) {
            return (
              <CartLine
                key={item.id}
                product={item.product}
                size={item.size}
                color={item.color}
                quantity={item.quantity}
                variantId={item.variantId}
              />
            );
          }
        })}
    </div>
  ) : (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {normalizedCart &&
        normalizedCart.map((item) => {
          if (item) {
            return (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-4 border rounded-md bg-muted mb-3"
              >
                {/* Product Details */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md bg-muted">
                    <CartLineImage
                      altText={String(item.product.name)}
                      imageUrl={item.product.images[0]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium text-sm">
                      {item.product.name}
                    </div>
                    {(item.color || item.size) && (
                      <p className="text-sm text-muted-foreground">
                        {item.color && item.size
                          ? `${item.color} / ${item.size}`
                          : item.color
                          ? item.color
                          : item.size}
                      </p>
                    )}
                  </div>
                </div>
                {/* Quantity Controls */}
                <div className="flex items-center justify-center space-x-2 w-24">
                  <MinusIcon
                    className={cn("w-5 h-5", {
                      "text-gray-400 cursor-not-allowed": item.quantity === 1,
                    })}
                    onClick={() => {
                      if (item.quantity! > 1) {
                        handleDecrease(item);
                      }
                    }}
                  />
                  <p className="w-6 text-center">
                    <span className="w-full text-sm hover:cursor-pointer">
                      {item.quantity}
                    </span>
                  </p>
                  <PlusIcon
                    className="w-5 h-5 hover:cursor-pointer"
                    onClick={() => handleIncrease(item)}
                  />
                </div>
                {/* Price */}
                <div className="text-right w-32">
                  {item.product.price !== item.product.basePrice ? (
                    <div className="text-sm">
                      {formatPrice(item.product.price! * item.quantity!)}
                    </div>
                  ) : (
                    <div className="text-sm">
                      {formatPrice(item.product.basePrice * item.quantity!)}
                    </div>
                  )}
                </div>
                {/* Delete Button */}
                <div className="flex justify-end w-12">
                  <button onClick={() => handleRemove(item)} className="p-1">
                    <MdDeleteOutline className="h-6 w-6" />
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}
    </div>
  );
};

export default CartLines;
