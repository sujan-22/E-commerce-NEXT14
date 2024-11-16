"use client";

import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/useStore";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ProductSchema } from "@/lib/validationSchema";

export type Product = z.infer<typeof ProductSchema>;

interface ProductsResponse {
  products: Product[];
}

const Product = () => {
  const searchParams = useSearchParams();

  // Ensure currentSort is a valid string
  const currentSort: string = searchParams.get("sort") || "relevance";

  // Fetch products function
  async function fetchProducts(sort: string): Promise<ProductsResponse | null> {
    try {
      const response = await fetch(`/api/products?sort=${sort}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  }

  const { setAllProducts, setLoading } = useStore();

  // Using React Query to fetch the products
  const { data, error, isLoading } = useQuery<ProductsResponse | null>({
    queryKey: ["products", currentSort],
    queryFn: () => fetchProducts(currentSort),
    refetchInterval: 60000,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Update the Zustand store with fetched products and handle loading/error state
  useEffect(() => {
    setLoading(isLoading);
    if (data) {
      setAllProducts(data.products);
    }

    if (error) {
      // setError((error as Error).message);
    }
  }, [data, isLoading, error, setAllProducts, setLoading]);

  return null;
};

export default Product;
