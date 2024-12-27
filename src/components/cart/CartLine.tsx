import useStore, { Product } from "@/context/useStore";
import Link from "next/link";
import { cn, useFormatPrice } from "@/lib/utils";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import useCartStore from "@/context/useCartStore";
import useUserStore from "@/context/useUserStore";
import CartLineImage from "./components/CartLineImage";

interface CartLineProps {
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

const CartLine: React.FC<CartLineProps> = ({
    product,
    quantity,
    selectedSize,
    selectedColor,
}) => {
    const { removeFromCart, increaseQuantity, decreaseQuantity } =
        useCartStore();
    const { allProducts } = useStore();
    const { currentUser } = useUserStore();
    const { formatPrice } = useFormatPrice();

    const handleRemove = () => {
        removeFromCart(
            {
                productId: product.id!,
                selectedColor,
                selectedSize,
            },
            currentUser,
            allProducts
        );
    };

    const handleIncrease = () => {
        increaseQuantity(
            {
                productId: product.id!,
                selectedColor,
                selectedSize,
                quantity: quantity + 1,
            },
            currentUser,
            allProducts
        );
    };

    const handleDecrease = () => {
        decreaseQuantity(
            {
                productId: product.id!,
                selectedColor,
                selectedSize,
                quantity: quantity - 1,
            },
            currentUser,
            allProducts
        );
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
                        href={`/products/${product.id}`}
                        className="z-30 ml-2 flex flex-1 flex-row space-x-4"
                    >
                        <div className="relative w-20 h-20 overflow-hidden rounded-md border">
                            <div className="relative w-20 h-20 rounded-md bg-muted">
                                <CartLineImage
                                    altText={String(product.id)}
                                    imageUrl={product.availableImages[0]}
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between text-sm">
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
                    <p className="flex justify-end space-y-2 text-right text-sm">
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
                                "text-muted-foreground cursor-not-allowed":
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
