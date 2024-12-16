"use client";
import {
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
} from "@/components/ui/table";
import useStore from "@/context/useStore";
import Image from "next/image";
import { cn } from "@nextui-org/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";
import { useFormatPrice } from "@/lib/utils";
import useCartStore, { CartItem } from "@/context/useCartStore";
import useUserStore from "@/context/useUserStore";

const CartLines = () => {
    const { allProducts } = useStore();
    const { formatPrice } = useFormatPrice();
    const { currentUser } = useUserStore();
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
        useCartStore();

    // Handle remove item from cart
    const handleRemove = async (item: CartItem) => {
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
                quantity: item.quantity,
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
                quantity: item.quantity,
                productId: item.productId,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
            },
            currentUser,
            allProducts
        );
    };
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            <Table>
                <TableHeader className="text-sm font-semibold text-center">
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody className="space-y-4">
                    {cartItems.map((item) => {
                        const product = allProducts.find(
                            (p) => p.id === item.productId
                        );

                        if (product) {
                            return (
                                <TableRow key={item.productId}>
                                    <TableCell className="relative w-28 h-28 rounded-md bg-gray-200">
                                        <Image
                                            className="object-contain"
                                            quality={100}
                                            alt={product.name}
                                            src={product.availableImages[0]}
                                            fill
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {product.name}{" "}
                                        {(item.selectedColor ||
                                            item.selectedSize) && (
                                            <p className="text-sm text-muted-foreground dark:text-neutral-400">
                                                {item.selectedColor &&
                                                item.selectedSize
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
                                                onClick={() =>
                                                    handleIncrease(item)
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {product.collection.onsale?.newPrice ? (
                                            <>
                                                <span>
                                                    {formatPrice(
                                                        product.collection
                                                            .onsale.newPrice
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <span>
                                                {formatPrice(product.price)}
                                            </span>
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
