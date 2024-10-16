"use client";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/useStore"; // Import Zustand store
import { useEffect } from "react";

const Product = () => {
    async function fetchProducts() {
        try {
            const response = await fetch("/api/products", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return null; // Or handle error as needed
        }
    }

    const { setAllProducts, setLoading, setError } = useStore();

    // Use React Query for fetching
    const { data, error, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        refetchInterval: 60000, // Refetch every 60 seconds
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes before refetching
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Effect to update Zustand store based on React Query results
    useEffect(() => {
        // Set loading state
        setLoading(isLoading);

        // Update Zustand store when data is available
        if (data) {
            setAllProducts(data.products); // Assuming `products` is the array from the data
        }

        // Handle any error
        if (error) {
            setError(error.message);
        }
    }, [data, isLoading, error, setAllProducts, setLoading, setError]);

    return null;
};

export default Product;
