/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductSkeletonProps {
    size: "small" | "medium" | "large" | "full" | "square";
    isFeatured?: boolean;
    className?: string;
}

const ProductImageSkeleton: React.FC<ProductSkeletonProps> = ({
    size,
    isFeatured = false,
    className,
}) => {
    return (
        <Skeleton
            className={cn(
                "relative w-full overflow-hidden p-2 border rounded-md",
                className,
                {
                    "aspect-[11/14]": isFeatured,
                    "aspect-[9/16]": !isFeatured,
                    "aspect-[1/1]": size === "square",
                    "w-[180px]": size === "small",
                    "w-[320px]": size === "medium",
                    "w-[420px]": size === "large",
                    "w-full": size === "full",
                }
            )}
        ></Skeleton>
    );
};

export default ProductImageSkeleton;
