import { CartItem, CartStoreState } from "@/context/useCartStore";

export const updateGuestCart = (
    state: CartStoreState,
    action: "add" | "remove" | "increase" | "decrease",
    item: CartItem
): CartItem[] => {
    const { productId, selectedColor, selectedSize } = item;

    // Normalize null values for comparison
    const normalizedColor = selectedColor || "";
    const normalizedSize = selectedSize || "";

    const existingItem = state.cartItems.find(
        (cartItem) =>
            cartItem.productId === productId &&
            (cartItem.selectedColor || "") === normalizedColor &&
            (cartItem.selectedSize || "") === normalizedSize
    );

    if (action === "add") {
        if (existingItem) {
            // If the item exists, update the quantity
            return state.cartItems.map((cartItem) =>
                cartItem === existingItem
                    ? {
                          ...cartItem,
                          quantity: cartItem.quantity! + 1,
                      }
                    : cartItem
            );
        } else {
            // Add the new item
            return [
                ...state.cartItems,
                {
                    ...item,
                    quantity: 1, // Set initial quantity to 1
                    selectedColor: normalizedColor,
                    selectedSize: normalizedSize,
                },
            ];
        }
    } else if (action === "remove") {
        // Remove the item
        return state.cartItems.filter(
            (cartItem) =>
                !(
                    cartItem.productId === productId &&
                    cartItem.selectedColor === normalizedColor &&
                    cartItem.selectedSize === normalizedSize
                )
        );
    } else if (action === "increase") {
        // Increase the quantity
        return state.cartItems.map((cartItem) =>
            cartItem === existingItem
                ? { ...cartItem, quantity: cartItem.quantity! + 1 }
                : cartItem
        );
    } else if (action === "decrease") {
        // Decrease the quantity (but not below 1)
        return state.cartItems.map((cartItem) =>
            cartItem === existingItem && cartItem.quantity! > 1
                ? { ...cartItem, quantity: cartItem.quantity! - 1 }
                : cartItem
        );
    }

    return state.cartItems; // Default case
};
