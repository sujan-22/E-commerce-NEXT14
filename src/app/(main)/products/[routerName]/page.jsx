// pages/products/[productId]/page.js
"use client";

import Product from "./Product";
import { fetchProductByRouterName } from "../../actions/product-actions/actions";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import ProductPageSkeleton from "./components/ProductPageSkeleton";

const Page = ({ params }) => {
    const routerName = params.routerName;
    const { data: product } = useQuery({
        queryKey: ["get-product-by-name"],
        queryFn: async () => await fetchProductByRouterName(routerName),
        retry: false,
    });

    if (!product || product.routerName !== routerName) {
        return <ProductPageSkeleton />;
    }

    return (
        <Suspense>
            <Product product={product} />;
        </Suspense>
    );
};

export default Page;
