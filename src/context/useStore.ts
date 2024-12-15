import { ProductSchema } from "@/lib/validationSchema";
import { z } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Product = z.infer<typeof ProductSchema>;

interface StoreState {
    allProducts: Product[];
    categories: string[];
    searchQuery: string;
    searchResults: string[];
    uploadedImageUrls: string[];

    setAllProducts: (products: Product[]) => void;
    setCategories: (categories: string[]) => void;
    setSearchQuery: (query: string) => void;
    setSearchResults: (results: string[]) => void;
    setUploadedImageUrls: (urls: string[]) => void;
    removeUploadedImageUrl: (urlToRemove: string) => void;
    clearUploadedImageUrls: () => void;
}

const useStore = create<StoreState>()(
    persist(
        (set) => ({
            allProducts: [],
            categories: [],
            searchQuery: "",
            searchResults: [],

            uploadedImageUrls: [],
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
        }),
        {
            name: "store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                uploadedImageUrls: state.uploadedImageUrls,
            }),
        }
    )
);

export default useStore;
