"use client";
import { Button } from "@/components/ui/button";
import useStore from "@/context/useStore";
import { cn, useFormatPrice } from "@/lib/utils";
import { Order } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import CartLineImage from "@/components/cart/components/CartLineImage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const OrderCard = ({ order }: { order: Order }) => {
  const { formatPrice } = useFormatPrice();
  const { allProducts } = useStore();
  const router = useRouter();
  const numberOfLines = useMemo(() => {
    return (
      order.cart?.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0) ?? 0
    );
  }, [order]);

  const numberOfProducts = useMemo(() => {
    return order.cart?.length ?? 0;
  }, [order]);

  const orderItems = allProducts
    .filter((product) =>
      order.cart.some((item) => item.productId === product.id)
    )
    .map((product) => {
      const cartItem = order.cart.find((item) => item.productId === product.id);
      return {
        ...product,
        quantity: cartItem?.quantity,
      };
    });

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
          &nbsp;|&nbsp;<span className="px-1">{formatPrice(order.amount)}</span>
          &nbsp;|&nbsp;
        </span>
        <span>{`${numberOfLines} ${
          numberOfLines > 1 ? "items" : "item"
        }`}</span>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex small:grid-cols-4 gap-4 my-4">
          {orderItems.slice(0, 4).map((product) => (
            <div key={product.id} className="flex flex-col">
              {product.availableImages && (
                <div className="relative w-44 h-44 rounded-md bg-muted">
                  <CartLineImage
                    altText={String(product.id)}
                    imageUrl={product.availableImages[0]}
                  />
                </div>
              )}
              <div className="flex justify-between text-muted-foreground mt-2">
                <span>{product.name}</span>
                <span>X {product.quantity}</span>
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
          onClick={() => router.push(`/order-details?orderId=${order.id}`)}
        >
          See details
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
