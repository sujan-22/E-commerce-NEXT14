import { ProductSchema } from "@/lib/validationSchema";
import { z } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser } from "auth-client";
import { updateGuestCart } from "@/lib/cart-utils/GuestCart";
import {
    addItemToCart,
    getCartItemsForUser,
    removeItemFromCart,
    updateQuantityInCart,
} from "@/app/(main)/actions/cart-actions/actions";
import { Product as IProduct } from "@prisma/client";

export type Product = z.infer<typeof ProductSchema>;

export interface ICartItem {
    id: string;
    quantity: number;
    color: string;
    size: string;
    product: IProduct;
    variantId: string;
}

export interface ICart {
    id: string;
    items: ICartItem[];
}

export interface IGuestCart {
    quantity: number;
    color: string;
    size: string;
    productId: string;
    product: IProduct;
    variantId: string;
}

export type ICartLine = {
    items: ICartItem[];
    cartTotal: number;
    cartItemsCount: number;
};

export interface CartStoreState {
    cartItemsCount: number;
    cartTotal: number;
    cart: ICart | null;
    guestCart: IGuestCart[];

    addToCart: (
        productId: string,
        variantId: string,
        user: IUser | null,
        quantity: number,
        color: string,
        size: string,
        product: IProduct
    ) => void;
    handleItemQuantity: (
        user: IUser | null,
        productId: string,
        variantId: string,
        operation: "increment" | "decrement",
        color: string,
        size: string,
        product: IProduct
    ) => void;
    removeFromCart: (
        user: IUser | null,
        productId: string,
        variantId: string,
        color: string,
        size: string,
        product: IProduct
    ) => void;
    clearCart: () => void;
    clearGuestCart: () => void;
    syncCartWithServer: (user: IUser | null | undefined) => void;
}

const useCartStore = create<CartStoreState>()(
    persist(
        (set, get) => ({
            cartTotal: 0,
            cartItemsCount: 0,
            cart: null,
            guestCart: [],

            syncCartWithServer: async (user) => {
                if (!user?.id) return;

                try {
                    const cart = await getCartItemsForUser(user.id);
                    if (cart) {
                        const cartObj: ICart = {
                            id: cart.id,
                            items: cart.items,
                        };
                        set({
                            cartTotal: cart.cartTotal,
                            cart: cartObj,
                            cartItemsCount: cart.cartItemsCount,
                        });
                    }
                } catch (error) {
                    console.error("Failed to sync cart with server:", error);
                }
            },

            addToCart: async (
                productId,
                variantId,
                user,
                quantity,
                color,
                size,
                product
            ) => {
                if (user) {
                    try {
                        await addItemToCart(
                            user.id,
                            productId,
                            variantId,
                            quantity
                        );
                        get().syncCartWithServer(user);
                    } catch (error) {
                        console.error("Error adding item to cart:", error);
                    }
                } else {
                    set((state) => {
                        const { updatedCart, updatedTotal, updatedItemsCount } =
                            updateGuestCart(
                                state,
                                "add",
                                color,
                                size,
                                productId,
                                product,
                                variantId
                            );
                        return {
                            guestCart: updatedCart,
                            cartTotal: updatedTotal,
                            cartItemsCount: updatedItemsCount,
                        };
                    });
                }
            },
            handleItemQuantity: async (
                user,
                productId,
                variantId,
                operation,
                color,
                size,
                product
            ) => {
                if (user) {
                    try {
                        await updateQuantityInCart(
                            user.id,
                            productId,
                            variantId,
                            operation
                        );
                        get().syncCartWithServer(user);
                    } catch (error) {
                        console.error(
                            "Failed to decrease quantity in server cart:",
                            error
                        );
                    }
                } else {
                    set((state) => {
                        const { updatedCart, updatedTotal, updatedItemsCount } =
                            updateGuestCart(
                                state,
                                operation,
                                color,
                                size,
                                productId,
                                product,
                                variantId
                            );
                        return {
                            guestCart: updatedCart,
                            cartTotal: updatedTotal,
                            cartItemsCount: updatedItemsCount,
                        };
                    });
                }
            },

            removeFromCart: async (
                user,
                productId,
                variantId,
                color,
                size,
                product
            ) => {
                if (user) {
                    try {
                        await removeItemFromCart(user.id, productId, variantId);
                        get().syncCartWithServer(user);
                    } catch (error) {
                        console.error(
                            "Failed to remove item from server cart:",
                            error
                        );
                    }
                } else {
                    set((state) => {
                        const { updatedCart, updatedTotal, updatedItemsCount } =
                            updateGuestCart(
                                state,
                                "remove",
                                color,
                                size,
                                productId,
                                product,
                                variantId
                            );
                        return {
                            guestCart: updatedCart,
                            cartTotal: updatedTotal,
                            cartItemsCount: updatedItemsCount,
                        };
                    });
                }
            },

            clearGuestCart: () =>
                set({ guestCart: [], cartTotal: 0, cartItemsCount: 0 }),
            clearCart: () =>
                set({ cart: null, cartTotal: 0, cartItemsCount: 0 }),
        }),
        {
            name: "cart-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                guestCart: state.guestCart,
                cartTotal: state.cartTotal,
                cartItemsCount: state.cartItemsCount,
            }),
        }
    )
);

export default useCartStore;
