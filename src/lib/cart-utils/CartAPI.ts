import { CartItem } from "@/context/useCartStore";

export const CartAPI = async (
    action: "add" | "remove" | "update",
    userId: string,
    item: CartItem
) => {
    try {
        const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                userId,
                productId: item.productId,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
            }),
        });

        if (!response.ok) {
            throw new Error("API call failed");
        }
    } catch (error) {
        console.error(`Error in cart API call (${action}):`, error);
        throw error;
    }
};

export const SyncCartAPI = async (userId: string) => {
    try {
        const res = await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({
                action: "get",
                userId: userId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("API call failed");
        }

        const data: { cartItems: CartItem[] } = await res.json();
        return data.cartItems;
    } catch (error) {
        console.error(`Error fetching cart for: `, error);
        throw error;
    }
};