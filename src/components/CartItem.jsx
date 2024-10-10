import useStore from "@/context/useStore";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";

const CartItem = ({ product, quantity, selectedSize, selectedColor }) => {
    const removeFromCart = useStore((state) => state.removeFromCart);

    return (
        <div className="space-y-3 py-2">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-4">
                    <div className="relative aspect-square h-[8rem] w-[8rem] min-w-fit overflow-hidden rounded bg-gray-100">
                        <Image
                            src={product.availableImages[0]}
                            alt={product.name}
                            fill
                            className="absolute object-cover"
                        />
                    </div>

                    <div className="flex flex-col self-start">
                        <span className="line-clamp-1 text-md font-medium mb-1">
                            {product.name}
                        </span>

                        <span className="line-clamp-1 text-sm capitalize text-muted-foreground">
                            {selectedColor}
                        </span>
                        <span className="line-clamp-1 text-sm capitalize text-muted-foreground">
                            Size: {selectedSize}
                        </span>
                        <span className="line-clamp-1 text-sm capitalize text-muted-foreground">
                            Quantity: {quantity}
                        </span>
                    </div>
                </div>

                <div className="flex items-center flex-col space-y-1 font-medium">
                    <span className="ml-auto line-clamp-1 text-md mb-1">
                        ${product.price}
                    </span>
                    <span>
                        <button
                            onClick={() => removeFromCart(product.id)}
                            className="flex items-center gap-0.5"
                        >
                            <Trash2Icon className="w-5 h-5" />
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
