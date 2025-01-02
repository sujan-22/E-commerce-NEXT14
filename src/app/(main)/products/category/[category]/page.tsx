// app/products/category/[category]/page.js
"use client";

import { fetchAllProducts } from "@/app/(main)/actions/product-actions/actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Categories from "./components/Categories";
import { useEffect, useState } from "react";
import CategoriesSkeleton from "@/components/skeletons/CategoriesSkeleton";

const Page = ({ params }: { params: { category: string } }) => {
    const searchParams = useSearchParams();
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobileView(width < 900);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const sort = searchParams.get("sort");
    const category = params.category;
    const { data: products } = useQuery({
        queryKey: ["get-products-by-category"],
        queryFn: async () => await fetchAllProducts(),
        retry: 4,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const filteredProducts =
        category === "all"
            ? products
            : products?.filter((product) => product.category === category);

    let sortedProducts = filteredProducts;

    if (sort && sort !== "none") {
        sortedProducts = filteredProducts?.sort((a, b) => {
            if (sort === "price_low_to_high") {
                return a.price === b.price
                    ? a.basePrice - b.basePrice
                    : a.price! - b.price!;
            } else if (sort === "price_high_to_low") {
                return a.price === b.price
                    ? b.basePrice - a.basePrice
                    : b.price! - a.price!;
            }
            return 0;
        });
    }

    if (!sortedProducts) {
        return <CategoriesSkeleton isMobileView={isMobileView} />;
    }

    return <Categories isMobileView={isMobileView} products={sortedProducts} />;
};

export default Page;
