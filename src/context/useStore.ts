import { ProductSchema } from "@/lib/validationSchema";
import { z } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Product = z.infer<typeof ProductSchema>;

// Interface for cart item
export interface CartItem {
  productId: number;
  selectedColor: string;
  selectedSize: string;
  quantity?: number;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  seller?: boolean;
}

interface StoreState {
  userData: IUser | null;
  loading: boolean;
  allProducts: Product[];
  categories: string[];
  searchQuery: string;
  searchResults: string[];
  cartItems: CartItem[];
  cartTotal: number;
  uploadedImageUrls: string[];

  setUserData: (data: IUser) => void;
  setLoading: (loading: boolean) => void;
  setAllProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: string[]) => void;
  setUploadedImageUrls: (urls: string[]) => void;
  removeUploadedImageUrl: (urlToRemove: string) => void;
  clearUploadedImageUrls: () => void;
  addToCart: (item: Omit<CartItem, "price"> & { productId: number }) => void;
  decreaseQuantity: (item: CartItem) => void;
  increaseQuantity: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  calculateCartTotal: () => void;
  clearCart: () => void;
  logoutUser: () => void;
  syncCartWithServer: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userData: null,
      loading: true,
      allProducts: [],
      categories: [],
      searchQuery: "",
      searchResults: [],

      cartItems: [],
      cartTotal: 0,

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

      removeUploadedImageUrl: (urlToRemove) =>
        set((state) => ({
          uploadedImageUrls: state.uploadedImageUrls.filter(
            (url) => url !== urlToRemove
          ),
        })),

      clearUploadedImageUrls: () => set({ uploadedImageUrls: [] }),

      syncCartWithServer: async () => {
        const userData = get().userData;
        if (!userData?.id) return;

        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({
              action: "get",
              userId: userData.id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data: { cartItems: CartItem[]; cartTotal: number } =
            await res.json();

          if (data.cartItems) {
            set({
              cartItems: data.cartItems,
              cartTotal: data.cartTotal,
            });
          }
        } catch (error) {
          console.error("Failed to sync cart with server:", error);
        }
      },

      addToCart: (item) =>
        set((state) => {
          const { productId, selectedColor, selectedSize } = item;

          // Normalize null values by replacing them with empty strings for comparison
          const normalizedColor = selectedColor || "";
          const normalizedSize = selectedSize || "";

          // Find the product price
          const product = state.allProducts.find((p) => p.id === productId);
          const price =
            product?.collection?.onsale?.newPrice ?? product?.price ?? 0;

          // Find an existing item with the same productId, color, and size
          const existingItem = state.cartItems.find(
            (cartItem) =>
              cartItem.productId === productId &&
              (cartItem.selectedColor || "") === normalizedColor &&
              (cartItem.selectedSize || "") === normalizedSize
          );

          let updatedCart;

          if (existingItem) {
            // If the item exists, update the quantity
            updatedCart = state.cartItems.map((cartItem) =>
              cartItem.productId === productId &&
              (cartItem.selectedColor || "") === normalizedColor &&
              (cartItem.selectedSize || "") === normalizedSize
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity! + 1,
                  }
                : cartItem
            );
          } else {
            // If it's a new item, add it to the cart with price
            updatedCart = [
              ...state.cartItems,
              {
                ...item,
                quantity: 1, // Set initial quantity to 1
                selectedColor: normalizedColor,
                selectedSize: normalizedSize,
                price: price, // Add the price to the cart item
              },
            ];
          }

          return { cartItems: updatedCart };
        }),

      decreaseQuantity: (item) =>
        set((state) => {
          const { productId, selectedColor, selectedSize } = item;
          const updatedCart = state.cartItems.map((cartItem) =>
            cartItem.productId === productId &&
            (cartItem.selectedColor || "") === (selectedColor || "") &&
            (cartItem.selectedSize || "") === (selectedSize || "")
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity! > 1
                      ? cartItem.quantity! - 1
                      : cartItem.quantity,
                }
              : cartItem
          );
          return { cartItems: updatedCart };
        }),

      // Increase item quantity
      increaseQuantity: (item) =>
        set((state) => {
          const { productId, selectedColor, selectedSize } = item;
          const updatedCart = state.cartItems.map((cartItem) =>
            cartItem.productId === productId &&
            (cartItem.selectedColor || "") === (selectedColor || "") &&
            (cartItem.selectedSize || "") === (selectedSize || "")
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity! + 1,
                }
              : cartItem
          );
          return { cartItems: updatedCart };
        }),

      // Remove item from cart
      removeFromCart: (item) =>
        set((state) => {
          const { productId, selectedColor, selectedSize } = item;

          // Filter out the item with matching productId, selectedColor, and selectedSize
          const updatedCart = state.cartItems.filter(
            (cartItem) =>
              !(
                cartItem.productId === productId &&
                cartItem.selectedColor === selectedColor &&
                cartItem.selectedSize === selectedSize
              )
          );

          return { cartItems: updatedCart };
        }),

      calculateCartTotal: () => {
        return set((state) => {
          const cartTotal = state.cartItems.reduce((total, item) => {
            return total + item.price! * item.quantity!;
          }, 0);
          return { cartTotal };
        });
      },

      // Clear the cart
      clearCart: () => set({ cartItems: [], cartTotal: 0 }),

      logoutUser: () => {
        set({ userData: null, cartItems: [] });
      },
    }),
    {
      name: "store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userData: state.userData,
        cartItems: state.cartItems,
        uploadedImageUrls: state.uploadedImageUrls,
      }),
    }
  )
);

export default useStore;
