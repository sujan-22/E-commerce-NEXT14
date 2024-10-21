// src/context/useStore.js
import { create } from "zustand";

const useStore = create((set) => ({
    allProducts: [],
    cartItems: [],
    categories: [],
    userData: [],
    loading: true,
    searchQuery: "",
    searchResults: [],

    setAllProducts: (products) => set({ allProducts: products }),
    setLoading: (loading) => set({ loading }), // Action to set loading
    setError: (error) => set({ error }),
    setCategories: (categories) => set({ categories }),

    // Async function to fetch products from API
    fetchAllProducts: async () => {
        set({ loading: true }); // Start loading

        try {
            const response = await fetch("/api/products"); // Fetch products from API
            const data = await response.json();

            if (response.ok) {
                set({ allProducts: data.products, loading: false }); // Set products and stop loading
            } else {
                set({ error: data.error, loading: false }); // Handle errors
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            set({ error: "Failed to fetch products", loading: false }); // Handle fetch failure
        }
    },

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
            // localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cartItems: updatedCart };
        }),
    removeFromCart: (item) =>
        set((state) => {
            const { productId, selectedColor, selectedSize } = item;
            const existingItem = state.cartItems.find(
                (cartItem) =>
                    cartItem.productId === productId &&
                    cartItem.selectedColor === selectedColor &&
                    cartItem.selectedSize === selectedSize
            );

            let updatedCart;

            if (existingItem && existingItem.quantity > 1) {
                // Decrease quantity if more than 1
                updatedCart = state.cartItems.map((cartItem) =>
                    cartItem.productId === productId &&
                    cartItem.selectedColor === selectedColor &&
                    cartItem.selectedSize === selectedSize
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                );
            } else {
                // Remove the item from the cart if quantity is 1
                updatedCart = state.cartItems.filter(
                    (cartItem) =>
                        !(
                            cartItem.productId === productId &&
                            cartItem.selectedColor === selectedColor &&
                            cartItem.selectedSize === selectedSize
                        )
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
