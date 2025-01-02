/* eslint-disable @next/next/no-img-element */
"use client";

import useStore from "@/context/useStore";
import Loader from "@/components/utility/Loader";
import ProductDetails from "./components/product-details";

const PageClient = ({ productId }: { productId: string }) => {
    const { allProducts } = useStore();

    const product = allProducts.find((prod) => prod.id === parseInt(productId));
    if (!product) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <h3 className="font-semibold text-xl">Loading data...</h3>
                    <p>This won&apos;t take too long!</p>
                </div>
            </div>
        );
    }

    return <ProductDetails product={product} />;
};

export default PageClient;
