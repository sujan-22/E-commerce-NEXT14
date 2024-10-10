"use client";
import products from "@/data/products";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Global Context
const GlobalContext = createContext();

// Dummy function for default cart state
const getDefaultCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : []; // Ensure it returns an array
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

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (cartItem) =>
                    cartItem.productId === item.productId &&
                    cartItem.selectedColor === item.selectedColor &&
                    cartItem.selectedSize === item.selectedSize
            );

            let updatedCart;

            if (existingItem) {
                // If item already exists, increase quantity
                updatedCart = prevItems.map((cartItem) =>
                    cartItem.productId === item.productId &&
                    cartItem.selectedColor === item.selectedColor &&
                    cartItem.selectedSize === item.selectedSize
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // Add new item with quantity 1
                updatedCart = [...prevItems, { ...item, quantity: 1 }]; // Ensure quantity is set to 1 for new items
            }

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.productId === itemId
            );

            let updatedCart;

            if (existingItem && existingItem.quantity > 1) {
                updatedCart = prevItems.map((item) =>
                    item.productId === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                updatedCart = prevItems.filter(
                    (item) => item.productId !== itemId
                );
            }

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    return (
        <GlobalContext.Provider
            value={{
                allProducts,
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
