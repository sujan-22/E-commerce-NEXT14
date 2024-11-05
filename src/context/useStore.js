import { create } from "zustand";

const useStore = create((set) => ({
    userData: null,
    loading: true,
    allProducts: [],
    cartItems: [],
    categories: [],
    searchQuery: "",
    searchResults: [],
    uploadedImageUrls: [],

    setUserData: (data) => {
        set({ userData: data });
    },
    setLoading: (loading) => set({ loading }),
    setAllProducts: (products) => set({ allProducts: products }),
    setCategories: (categories) => set({ categories }),
    setUploadedImageUrls: (urls) => set({ uploadedImageUrls: urls }),
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
                        ? {
                              ...cartItem,
                              quantity: cartItem.quantity + 1,
                          }
                        : cartItem
                );
            } else {
                // Add new item with quantity 1
                updatedCart = [...state.cartItems, { ...item, quantity: 1 }];
            }

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
                        ? {
                              ...cartItem,
                              quantity: cartItem.quantity - 1,
                          }
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

            return { cartItems: updatedCart };
        }),
    logoutUser: () => {
        set({ userData: null });
    },
}));

export default useStore;
