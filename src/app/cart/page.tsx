"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useStore, { CartItem } from "@/context/useStore";

const CartPage = () => {
  const { allProducts } = useStore();
  const { data: session } = useSession();
  const cartItemsFromStore = useStore((state) => state.cartItems) as CartItem[];
  const cartTotalFromStore = useStore((state) => state.cartTotal) as number;
  const [cartItems, setCartItems] = useState<CartItem[]>(cartItemsFromStore);
  const [cartTotal, setCartTotal] = useState<number>(cartTotalFromStore);
  const [itemCount, setItemCount] = useState<number>(0);

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Cart Items Section */}
        <div className="flex-1">
          {false ? (
            <></>
          ) : (
            <div className="mb-10">
              <h1 className="text-xl font-semibold ">
                Already have an account?{" "}
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to proceed with your order.
              </p>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:w-1/3 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>${cartTotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between">
              <p>Taxes</p>
              <p>$0.00</p>
            </div>
            <div className="border-t pt-4 flex justify-between font-semibold">
              <p>Total</p>
              <p>${cartTotal}</p>
            </div>
          </div>
          <Button className="w-full mt-6">Go to Checkout</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CartPage;
