// src/context/useStore.js
import products from "@/data/products";
import { create } from "zustand";

const useStore = create((set) => ({
    allProducts: products.products,
    cartItems: JSON.parse(localStorage.getItem("cart")) || [],
    userData: [],
    loading: true,
    searchQuery: "",
    searchResults: [],

    // Actions
    setAllProducts: (products) => set({ allProducts: products }),
    addToCart: (item) =>
        set((state) => {
            const existingItem = state.cartItems.find(
                (cartItem) =>
                    cartItem.productId === item.productId &&
                    cartItem.selectedColor === item.selectedColor &&
                    cartItem.selectedSize === item.selectedSize
            );

            let updatedCart;

            if (existingItem) {
                // Increase quantity if item already exists
                updatedCart = state.cartItems.map((cartItem) =>
                    cartItem.productId === item.productId &&
                    cartItem.selectedColor === item.selectedColor &&
                    cartItem.selectedSize === item.selectedSize
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // Add new item with quantity 1
                updatedCart = [...state.cartItems, { ...item, quantity: 1 }];
            }

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cartItems: updatedCart };
        }),
    removeFromCart: (itemId) =>
        set((state) => {
            const existingItem = state.cartItems.find(
                (item) => item.productId === itemId
            );
            let updatedCart;

            if (existingItem && existingItem.quantity > 1) {
                updatedCart = state.cartItems.map((item) =>
                    item.productId === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                updatedCart = state.cartItems.filter(
                    (item) => item.productId !== itemId
                );
            }

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cartItems: updatedCart };
        }),
    setUserData: (data) => set({ userData: data }),
    setLoading: (loading) => set({ loading }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSearchResults: (results) => set({ searchResults: results }),
}));

export default useStore;
