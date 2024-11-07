import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
    persist(
        (set) => ({
            userData: null,
            loading: true,
            allProducts: [],
            categories: [],
            searchQuery: "",
            searchResults: [],

            cartItems: [],
            uploadedImageUrls: [],

            setUserData: (data) => set({ userData: data }),
            setLoading: (loading) => set({ loading }),
            setAllProducts: (products) => set({ allProducts: products }),
            setCategories: (categories) => set({ categories }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setSearchResults: (results) => set({ searchResults: results }),

            setUploadedImageUrls: (urls) =>
                set((state) => ({
                    uploadedImageUrls: [...state.uploadedImageUrls, ...urls],
                })),

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
                        updatedCart = [
                            ...state.cartItems,
                            { ...item, quantity: 1 },
                        ];
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
        }),
        {
            name: "store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cartItems: state.cartItems,
                uploadedImageUrls: state.uploadedImageUrls,
            }),
        }
    )
);

export default useStore;
