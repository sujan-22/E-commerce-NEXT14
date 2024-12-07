"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import useStore, { CartItem } from "@/context/useStore";
import Image from "next/image";
import { cn } from "@nextui-org/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";
import { useFormatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const CartLines = () => {
  const { allProducts } = useStore();
  const { formatPrice } = useFormatPrice();
  // const { data: session } = useSession();
  const cartItemsFromStore = useStore((state) => state.cartItems) as CartItem[];
  const removeFromCart = useStore((state) => state.removeFromCart);
  const increaseQuantity = useStore((state) => state.increaseQuantity);
  const decreaseQuantity = useStore((state) => state.decreaseQuantity);
  const userData = useStore((state) => state.userData);

  // Handle remove item from cart
  const handleRemove = async (item: CartItem) => {
    removeFromCart({
      quantity: item.quantity,
      productId: item.productId!,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  };

  const handleIncrease = async (item: CartItem) => {
    increaseQuantity({
      quantity: item.quantity,
      productId: item.productId,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    });
  };

  const handleDecrease = async (item: CartItem) => {
    decreaseQuantity({
      quantity: item.quantity,
      productId: item.productId,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    });
  };
  return (
    <div>
      {!userData && (
        <div className="items-center mb-6">
          <h3 className="text-muted-foreground mb-6">
            Sign in to proceed to checkout{" "}
          </h3>
          <Separator />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      <Table>
        <TableHeader className="text-md font-semibold text-center">
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
            const product = allProducts.find((p) => p.id === item.productId);

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
                  <TableCell className="text-center">
                    <div className="flex h-8 flex-row items-center justify-center rounded-full px-2">
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
                  <TableCell className="text-center">
                    {product.collection.onsale?.newPrice ? (
                      <>
                        <span>
                          {formatPrice(product.collection.onsale.newPrice)}
                        </span>
                      </>
                    ) : (
                      <span>{formatPrice(product.price)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <MdDeleteOutline
                      size={20}
                      className="cursor-pointer"
                      onClick={() => handleRemove(item)}
                    />
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

export default CartLines;
