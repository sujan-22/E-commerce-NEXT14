import { calculateCartTotal } from "@/components/cart/utils/calculateTotal";
import { IGuestCart, CartStoreState } from "@/context/useCartStore";
import { Product } from "@prisma/client";

export const updateGuestCart = (
    state: CartStoreState,
    action: "add" | "remove" | "increment" | "decrement",
    color: string,
    size: string,
    productId: string,
    product: Product,
    variantId: string
): {
    updatedCart: IGuestCart[];
    updatedTotal: number;
    updatedItemsCount: number;
} => {
    const updatedCart = [...state.guestCart];

    const itemIndex = updatedCart.findIndex(
        (item) =>
            item.productId === productId &&
            item.color === color &&
            item.size === size
    );

    if (action === "add") {
        if (itemIndex > -1) {
            updatedCart[itemIndex].quantity += 1;
        } else {
            updatedCart.push({
                productId,
                color,
                size,
                quantity: 1,
                product,
                variantId,
            });
        }
    } else if (action === "remove" && itemIndex > -1) {
        updatedCart.splice(itemIndex, 1);
    } else if (action === "increment" && itemIndex > -1) {
        updatedCart[itemIndex].quantity += 1;
    } else if (action === "decrement" && itemIndex > -1) {
        updatedCart[itemIndex].quantity -= 1;
        if (updatedCart[itemIndex].quantity <= 0) {
            updatedCart.splice(itemIndex, 1);
        }
    }

    // Calculate updated totals
    const updatedTotal = calculateCartTotal(updatedCart);
    const updatedItemsCount = updatedCart.reduce(
        (count, item) => count + item.quantity,
        0
    );

    return { updatedCart, updatedTotal, updatedItemsCount };
};
