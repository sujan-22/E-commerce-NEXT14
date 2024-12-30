import ProductImageSkeleton from "@/components/product/skeleton/ProductImageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";

export default function Loading() {
    return (
        <MaxWidthWrapper>
            <div
                className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row lg:items-start py-6 relative"
                data-testid="product-container"
            >
                {/* Left part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                    <Skeleton />
                </div>

                {/* Middle part */}
                <div className="block w-full relative ">
                    <ProductImageSkeleton size="full" />
                </div>

                {/* Right part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                    <Skeleton />
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
