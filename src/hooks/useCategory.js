"use client";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/useStore";
import { useEffect } from "react";

const Category = () => {
    async function fetchCategories() {
        try {
            const response = await fetch("/api/getCategory", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return null;
        }
    }

    const { setCategories, setLoading, setError } = useStore();

    const { data, error, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        refetchInterval: 60000, // Re-fetch categories every minute
        staleTime: 5 * 60 * 1000, // Cache categories for 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setLoading(isLoading);
        if (data) {
            const capitalizedCategories = data.categories.map(
                (category) =>
                    category.charAt(0).toUpperCase() + category.slice(1)
            );
            setCategories(capitalizedCategories);
        }

        if (error) {
            setError(error.message);
        }
    }, [data, isLoading, error, setCategories, setLoading, setError]);
    return null;
};

export default Category;
