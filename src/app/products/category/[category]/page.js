// app/products/[category]/page.js

"use client";

import { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductList from "@/components/product/ProductList";
import useStore from "@/context/useStore";
import FilterSidebar from "@/components/FilterSidebar";
import SortSidebar from "@/components/SortSidebar";

const Page = ({ params }) => {
    const products = useStore((state) => state.allProducts);
    const [isMobileView, setIsMobileView] = useState(false);
    const category = params.category;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobileView(width < 900);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const filteredProducts =
        category === "all"
            ? products
            : products.filter((product) => product.category === category);

    return (
        <MaxWidthWrapper>
            {/* Main layout container */}
            <div
                className={`flex w-full ${
                    isMobileView ? "flex-col" : "justify-between"
                }`}
            >
                {/* Mobile dropdowns for Filter and Sort */}
                {isMobileView && (
                    <div className="my-4 flex flex-col gap-4 w-full">
                        {/* Render FilterSidebar as dropdown */}
                        <FilterSidebar mobileView={isMobileView} />

                        {/* Render SortSidebar as dropdown */}
                        <SortSidebar mobileView={isMobileView} />
                    </div>
                )}

                {/* Left Sidebar - Categories (hidden on mobile) */}
                {!isMobileView && <FilterSidebar mobileView={isMobileView} />}

                {/* Main Content - Products */}
                <div className={`w-full ${isMobileView ? "" : "w-[80%]"}`}>
                    <ProductList products={filteredProducts} size={"full"} />
                </div>

                {/* Right Sidebar - Sorting (hidden on mobile) */}
                {!isMobileView && <SortSidebar mobileView={isMobileView} />}
            </div>
        </MaxWidthWrapper>
    );
};

export default Page;
