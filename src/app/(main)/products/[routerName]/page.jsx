// pages/products/[productId]/page.js
"use client";

import Product from "./Product";
import { fetchProductByRouterName } from "../../actions/product-actions/actions";
import Loader from "@/components/utility/Loader";
import { useQuery } from "@tanstack/react-query";

const Page = ({ params }) => {
    const routerName = params.routerName;
    const { data: product } = useQuery({
        queryKey: ["get-product-by-name"],
        queryFn: async () => await fetchProductByRouterName(routerName),
        retry: false,
    });
    if (!product) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <h3 className="font-semibold text-xl">Loading...</h3>
                    <p>Please wait. This might take a moment!</p>
                </div>
            </div>
        );
    }
    return <Product product={product} />;
};

export default Page;
