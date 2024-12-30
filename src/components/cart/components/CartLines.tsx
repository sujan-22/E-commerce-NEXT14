"use client";
import useStore from "@/context/useStore";
import { cn } from "@nextui-org/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";
import { useFormatPrice } from "@/lib/utils";
import useCartStore, { CartItem } from "@/context/useCartStore";
import useUserStore from "@/context/useUserStore";
import CartLineImage from "./CartLineImage";
import { useState, useEffect } from "react";
import CartLine from "../CartLine";
import { Button } from "@/components/ui/button";

const CartLines = () => {
  const { allProducts } = useStore();
  const { formatPrice } = useFormatPrice();
  const { currentUser } = useUserStore();
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCartStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemove = (item: CartItem) => {
    removeFromCart(
      {
        quantity: item.quantity,
        productId: item.productId!,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      },
      currentUser,
      allProducts
    );
  };

  const handleIncrease = async (item: CartItem) => {
    increaseQuantity(
      {
        quantity: item.quantity! + 1,
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      },
      currentUser,
      allProducts
    );
  };

  const handleDecrease = async (item: CartItem) => {
    decreaseQuantity(
      {
        quantity: item.quantity! - 1,
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      },
      currentUser,
      allProducts
    );
  };

  return isMobile ? (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {cartItems.map((item) => {
        const product = allProducts.find((p) => p.id === item.productId);

        if (product) {
          return (
            <CartLine
              key={item.productId}
              product={product}
              selectedSize={item.selectedSize}
              selectedColor={item.selectedColor}
              quantity={item.quantity!}
            />
          );
        }
      })}
    </div>
  ) : (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {cartItems.map((item) => {
        const product = allProducts.find((p) => p.id === item.productId);

        if (product) {
          return (
            <div
              key={item.productId}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-4 border rounded-md bg-muted mb-3"
            >
              {/* Product Details */}
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md bg-muted">
                  <CartLineImage
                    altText={String(product.id)}
                    imageUrl={product.availableImages[0]}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{product.name}</div>
                  {(item.selectedColor || item.selectedSize) && (
                    <p className="text-sm text-muted-foreground">
                      {item.selectedColor && item.selectedSize
                        ? `${item.selectedColor} / ${item.selectedSize}`
                        : item.selectedColor
                        ? item.selectedColor
                        : item.selectedSize}
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
                {product.collection.onsale?.newPrice ? (
                  <div className="text-sm">
                    {formatPrice(
                      product.collection.onsale.newPrice * item.quantity!
                    )}
                  </div>
                ) : (
                  <div className="text-sm">
                    {formatPrice(product.price * item.quantity!)}
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
