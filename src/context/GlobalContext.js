"use client";
import products from "@/data/products";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Global Context
const GlobalContext = createContext();

// Dummy function for default cart state
const getDefaultCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
};

// Global Provider component
export const GlobalProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState(products.products);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // setAllProducts(products.products);

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products"); // Adjust API endpoint
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.productId === itemId
            );

            if (existingItem) {
                // If item already exists, increase quantity
                return prevItems.map((item) =>
                    item.productId === itemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item with quantity 1
                return [...prevItems, { productId: itemId, quantity: 1 }];
            }
        });
    };

    // Function to remove items from the cart
    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.productId === itemId
            );

            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map((item) =>
                    item.productId === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter((item) => item.productId !== itemId);
            }
        });
    };

    return (
        <GlobalContext.Provider
            value={{
                allProducts,
                setAllProducts,
                cartItems,
                addToCart,
                removeFromCart,
                userData,
                setUserData,
                loading,
                searchQuery,
                setSearchQuery,
                searchResults,
                setSearchResults,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);
