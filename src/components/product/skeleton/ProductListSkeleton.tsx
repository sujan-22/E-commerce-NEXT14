"use client";

import ProductImageSkeleton from "./ProductImageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
    size: "small" | "medium" | "large" | "full" | "square";
}

const ProductListSkeleton = ({ size }: ProductListProps) => {
    return (
        <div className=" py-20">
            <Skeleton className="h-8 mb-4 w-full" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex flex-col">
                        <ProductImageSkeleton
                            className="mx-auto"
                            size={size}
                            isFeatured={true}
                        />
                        <Skeleton className="h-8 mt-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListSkeleton;
