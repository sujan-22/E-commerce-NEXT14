//app/products/page.js
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductList from "@/components/product/ProductList";
import useStore from "@/context/useStore";

const Page = () => {
    const products = useStore((state) => state.allProducts);

    return (
        <MaxWidthWrapper>
            <FilterSidebar />
            <ProductList products={products} />
        </MaxWidthWrapper>
    );
};

const FilterSidebar = () => {
    return (
        <div className="w-[15%] border-r border-gray-300 p-4">
            <h2 className="font-bold text-lg mb-4">Filters</h2>
            {/* Add your filter options here */}
            <div className="mb-4">
                <h3 className="font-medium">Categories</h3>
                <ul>
                    <li>Category 1</li>
                    <li>Category 2</li>
                    <li>Category 3</li>
                </ul>
            </div>
            {/* Add more filters as needed */}
        </div>
    );
};

export default Page;
