"use client";

import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/useStore";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Product = () => {
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "relevance";
    async function fetchProducts(sort) {
        try {
            const response = await fetch(`/api/products?sort=${sort}`, {
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

    const { setAllProducts, setLoading, setError } = useStore();

    const { data, error, isLoading } = useQuery({
        queryKey: ["products", currentSort],
        queryFn: () => fetchProducts(currentSort),
        refetchInterval: 60000,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setLoading(isLoading);
        if (data) {
            setAllProducts(data.products);
        }

        if (error) {
            setError(error.message);
        }
    }, [data, isLoading, error, setAllProducts, setLoading, setError]);

    return null;
};

export default Product;
