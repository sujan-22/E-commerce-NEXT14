import useStore, { Product } from "@/context/useStore";
import { cn, formatPrice } from "@/lib/utils";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface CartLineProps {
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    fetchCartData: () => void;
}

const CartLine: React.FC<CartLineProps> = ({
    product,
    quantity,
    selectedSize,
    selectedColor,
    fetchCartData,
}) => {
    const { data: session } = useSession();
    const removeFromCart = useStore((state) => state.removeFromCart);
    const increaseQuantity = useStore((state) => state.increaseQuantity);
    const decreaseQuantity = useStore((state) => state.decreaseQuantity);

    // Handle remove item from cart
    const handleRemove = async (): Promise<void> => {
        if (session) {
            // If user is logged in, make an API call to remove from cart
            await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({
                    action: "remove",
                    userId: session.user?.id,
                    productId: product.id,
                    selectedColor,
                    selectedSize,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchCartData();
        } else {
            // Otherwise, remove from store (for guest users)
            removeFromCart({
                productId: product.id!,
                selectedColor,
                selectedSize,
            });
        }
    };

    // Handle increase item quantity
    const handleIncrease = async (): Promise<void> => {
        if (session) {
            await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({
                    action: "update",
                    userId: session.user?.id,
                    productId: product.id,
                    quantity: quantity + 1,
                    selectedColor,
                    selectedSize,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchCartData();
        } else {
            // Otherwise, increase quantity in store (for guest users)
            increaseQuantity({
                productId: product.id!,
                selectedColor,
                selectedSize,
            });
        }
    };

    // Handle decrease item quantity
    const handleDecrease = async (): Promise<void> => {
        if (session) {
            // If user is logged in, make an API call to update cart quantity
            await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({
                    action: "update",
                    userId: session.user?.id,
                    productId: product.id,
                    quantity: quantity - 1,
                    selectedColor,
                    selectedSize,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchCartData();
        } else {
            // Otherwise, decrease quantity in store (for guest users)
            decreaseQuantity({
                productId: product.id!,
                selectedColor,
                selectedSize,
            });
        }
    };

    return (
        <li className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                <div className="absolute z-40 -ml-1 -mt-2">
                    <button
                        onClick={handleRemove}
                        aria-label="Remove cart item"
                        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
                    >
                        <XIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
                    </button>
                </div>
                <div className="flex flex-row">
                    <Link
                        href={`products/${product.id}`}
                        className="z-30 ml-2 flex flex-1 flex-row space-x-4"
                    >
                        <div className="relative h-24 w-[30%] overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <Image
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={product.name}
                                src={product.availableImages[0]}
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-between text-base">
                            <span className="leading-tight">
                                {product.name}
                            </span>
                            {(selectedColor || selectedSize) && (
                                <p className="text-sm text-muted-foreground dark:text-neutral-400">
                                    {selectedColor && selectedSize
                                        ? `${selectedColor} / ${selectedSize}`
                                        : selectedColor
                                        ? selectedColor
                                        : selectedSize}
                                </p>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                    <p className="flex justify-end space-y-2 text-right text-base">
                        {product.collection.onsale?.newPrice ? (
                            <>
                                <span>
                                    {formatPrice(
                                        product.collection.onsale.newPrice
                                    )}
                                </span>
                            </>
                        ) : (
                            <span>{formatPrice(product.price)}</span>
                        )}
                    </p>

                    <div className="ml-auto flex h-8 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700 px-2">
                        <MinusIcon
                            className={cn("w-5 h-5", {
                                "text-gray-400 cursor-not-allowed":
                                    quantity === 1,
                            })}
                            onClick={quantity > 1 ? handleDecrease : undefined}
                        />
                        <p className="w-6 text-center">
                            <span className="w-full text-sm hover:cursor-pointer">
                                {quantity}
                            </span>
                        </p>
                        <PlusIcon
                            className="w-5 h-5 hover:cursor-pointer"
                            onClick={handleIncrease}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartLine;
