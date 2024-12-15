import { calculateCartTotal } from "@/components/cart/utils/calculateTotal";
import { ProductSchema } from "@/lib/validationSchema";
import { z } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser } from "auth-client";
import { CartAPI, SyncCartAPI } from "@/lib/cart-utils/CartAPI";
import { updateGuestCart } from "@/lib/cart-utils/GuestCart";

export type Product = z.infer<typeof ProductSchema>;
export interface CartItem {
    productId: number;
    selectedColor: string;
    selectedSize: string;
    quantity?: number;
}

export interface CartStoreState {
    cartItemsCount: number;
    cartItems: CartItem[];
    cartTotal: number;
    addToCart: (
        item: Omit<CartItem, "price"> & { productId: number },
        user: IUser | null,
        products: Product[]
    ) => void;
    decreaseQuantity: (
        item: CartItem,
        user: IUser | null,
        products: Product[]
    ) => void;
    increaseQuantity: (
        item: CartItem,
        user: IUser | null,
        products: Product[]
    ) => void;
    removeFromCart: (
        item: CartItem,
        user: IUser | null,
        products: Product[]
    ) => void;
    clearCart: () => void;
    syncCartWithServer: (user: IUser | null, products: Product[]) => void;
    syncGuestCart: (products: Product[]) => void;
}

const useCartStore = create<CartStoreState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            cartTotal: 0,
            cartItemsCount: 0,

            syncCartWithServer: async (user, products) => {
                if (!user?.id) return;

                try {
                    const cart = await SyncCartAPI(user.id);
                    if (cart) {
                        const cartTotal = calculateCartTotal(cart, products);
                        const cartItemsCount = cart.reduce(
                            (count, item) => count + (item.quantity || 1),
                            0
                        );
                        set({
                            cartTotal: cartTotal,
                            cartItems: cart,
                            cartItemsCount,
                        });
                    }
                } catch (error) {
                    console.error("Failed to sync cart with server:", error);
                }
            },

            syncGuestCart: (products) => {
                const cartTotal = calculateCartTotal(get().cartItems, products);
                const cartItemsCount = get().cartItems.reduce(
                    (count, item) => count + (item.quantity || 1),
                    0
                );
                set({
                    cartTotal,
                    cartItemsCount,
                });
            },

            addToCart: async (item, user, products) => {
                if (user) {
                    try {
                        await CartAPI("add", user.id, item);
                        get().syncCartWithServer(user, products);
                    } catch (error) {
                        console.error("Error adding item to cart:", error);
                    }
                } else {
                    set((state) => ({
                        cartItems: updateGuestCart(state, "add", item),
                    }));
                    get().syncGuestCart(products);
                }
            },
            decreaseQuantity: async (item, user, products) => {
                if (user) {
                    try {
                        await CartAPI("update", user.id, item);
                        get().syncCartWithServer(user, products);
                    } catch (error) {
                        console.error(
                            "Failed to decrease quantity in server cart:",
                            error
                        );
                    }
                } else {
                    set((state) => ({
                        cartItems: updateGuestCart(state, "decrease", item),
                    }));
                    get().syncGuestCart(products);
                }
            },

            // Increase item quantity
            increaseQuantity: async (item, user, products) => {
                if (user) {
                    try {
                        await CartAPI("update", user.id, item);
                        get().syncCartWithServer(user, products);
                    } catch (error) {
                        console.error(
                            "Failed to increase quantity in server cart:",
                            error
                        );
                    }
                } else {
                    set((state) => ({
                        cartItems: updateGuestCart(state, "increase", item),
                    }));
                    get().syncGuestCart(products);
                }
            },

            // Remove item from cart
            removeFromCart: async (item, user, products) => {
                if (user) {
                    try {
                        await CartAPI("remove", user.id, item);
                        get().syncCartWithServer(user, products);
                    } catch (error) {
                        console.error(
                            "Failed to remove item from server cart:",
                            error
                        );
                    }
                } else {
                    set((state) => ({
                        cartItems: updateGuestCart(state, "remove", item),
                    }));
                    get().syncGuestCart(products);
                }
            },

            clearCart: () =>
                set({ cartItems: [], cartTotal: 0, cartItemsCount: 0 }),
        }),
        {
            name: "cart-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cartItems: state.cartItems,
                cartTotal: state.cartTotal,
                cartItemsCount: state.cartItemsCount,
            }),
        }
    )
);

export default useCartStore;
