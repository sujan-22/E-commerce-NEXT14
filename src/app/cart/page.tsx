"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useSession } from "next-auth/react";
import useStore, { CartItem } from "@/context/useStore";
import Image from "next/image";
import { cn } from "@nextui-org/react";
import { Delete, DeleteIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Tab } from "@headlessui/react";

const CartPage = () => {
  const { allProducts } = useStore();
  const { data: session } = useSession();
  const cartItemsFromStore = useStore((state) => state.cartItems) as CartItem[];
  const userData = useStore((state) => state.userData);
  const increaseQuantity = useStore((state) => state.increaseQuantity);
  const decreaseQuantity = useStore((state) => state.decreaseQuantity);
  const syncCartWithServer = useStore((state) => state.syncCartWithServer);

  const handleIncrease = async (item: CartItem): Promise<void> => {
    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) return;

    if (userData) {
      await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          userId: userData.id,
          productId: item.productId,
          quantity: item.quantity! + 1,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      syncCartWithServer();
    } else {
      increaseQuantity({
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    }
  };

  const handleDecrease = async (item: CartItem): Promise<void> => {
    if (userData) {
      await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          userId: userData.id,
          productId: item.productId,
          quantity: item.quantity! - 1,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      syncCartWithServer();
    } else {
      decreaseQuantity({
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    }
  };

  const calculateSubtotal = () => {};

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Cart Items Section */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell></TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItemsFromStore.map((item) => {
                const product = allProducts.find(
                  (p) => p.id === item.productId
                );

                if (product) {
                  return (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Image
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                          alt={product.name}
                          src={product.availableImages[0]}
                        />
                      </TableCell>
                      <TableCell>
                        {product.name}{" "}
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-sm text-muted-foreground dark:text-neutral-400">
                            {item.selectedColor && item.selectedSize
                              ? `${item.selectedColor} / ${item.selectedSize}`
                              : item.selectedColor
                              ? item.selectedColor
                              : item.selectedSize}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="ml-auto flex h-8 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700 px-2">
                          <MinusIcon
                            className={cn("w-5 h-5", {
                              "text-gray-400 cursor-not-allowed":
                                item.quantity === 1,
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
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>remove icon</TableCell>
                    </TableRow>
                  );
                }
                return null; // Skip rows without matching products
              })}
              <TableRow>
                <TableCell className="text-lg">Subtotal</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>$Subtotal</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:w-1/3 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>$</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between">
              <p>Taxes</p>
              <p>${"taxes"}</p>
            </div>
            <div className="border-t pt-4 flex justify-between font-semibold">
              <p>Total</p>
              <p>${"total"}</p>
            </div>
          </div>
          <Button className="w-full mt-6">Go to Checkout</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CartPage;
