import ProductImageSkeleton from "@/components/product/skeleton/ProductImageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import React from "react";

const ProductPageSkeleton = () => {
    return (
        <MaxWidthWrapper>
            <div
                className="w-full mx-auto gap-x-5 flex flex-col lg:flex-row lg:items-start py-6 relative max-h-[700px] overflow-hidden"
                data-testid="product-container"
            >
                {/* Left part */}
                <div className="h-screen lg:sticky lg:top-0 lg:max-w-[400px] w-full flex flex-col gap-4 py-8">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/4" />

                    <Skeleton className="h-4 w-2/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>

                {/* Middle part */}
                <div className="flex-1 h-screen flex items-center overflow-hidden justify-center relative">
                    <ProductImageSkeleton size="full" />
                </div>

                {/* Right part */}
                <div className="h-screen lg:sticky lg:top-0 lg:max-w-[400px] w-full flex flex-col gap-4 py-8">
                    {/* Sentence */}
                    <Skeleton className="h-4 w-full" />
                    {/* Three buttons side by side */}
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-10 w-1/3" />
                    </div>
                    {/* Sentence */}
                    <Skeleton className="h-4 w-full" />
                    {/* Two buttons side by side */}
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-10 w-1/2" />
                    </div>
                    {/* Separator */}
                    <Skeleton className="h-1 w-full" />
                    {/* Sentence */}
                    <Skeleton className="h-4 w-full" />
                    {/* Button with full width */}
                    <Skeleton className="h-10 w-full" />
                    <div className="flex mt-10 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5" />
                    </div>{" "}
                    <Skeleton className="h-1 w-full" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5" />
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default ProductPageSkeleton;
