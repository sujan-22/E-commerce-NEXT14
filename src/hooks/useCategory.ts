"use client";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/useStore";
import { useEffect } from "react";

// Define the type for the response from the API
interface CategoriesResponse {
    categories: string[];
}

const Category = () => {
    // Function to fetch categories
    async function fetchCategories(): Promise<CategoriesResponse | null> {
        try {
            const response = await fetch("/api/getCategory", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CategoriesResponse = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Destructure necessary methods from your Zustand store
    const { setCategories } = useStore();

    // Use React Query to fetch categories
    const { data, error, isLoading } = useQuery<CategoriesResponse | null>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 60 * 60 * 1000, // Cache categories for an hour
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Update the Zustand store with the fetched data
    useEffect(() => {
        // setLoading(isLoading);
        if (data) {
            // Capitalize the first letter of each category
            const capitalizedCategories = data.categories.map(
                (category) =>
                    category.charAt(0).toUpperCase() + category.slice(1)
            );
            setCategories(capitalizedCategories);
        }

        if (error) {
            // Handle error by setting it in the store
            // setError((error as Error).message);
        }
    }, [data, isLoading, error, setCategories]);

    return null;
};

export default Category;
