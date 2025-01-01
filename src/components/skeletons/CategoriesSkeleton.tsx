import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import ProductImageSkeleton from "../product/skeleton/ProductImageSkeleton";

const CategoriesSkeleton = ({ isMobileView }: { isMobileView: boolean }) => {
    return (
        <MaxWidthWrapper>
            <div
                className={`flex w-full mt-20 ${
                    isMobileView ? "flex-col" : "justify-between"
                }`}
            >
                {isMobileView && (
                    <div className="my-4 flex flex-col gap-4 w-full">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                )}

                {!isMobileView && (
                    <div className="w-[10%] space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                )}

                <div className={`w-full ${isMobileView ? "" : "w-[75%]"}`}>
                    <div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex flex-col">
                                    <ProductImageSkeleton
                                        className="mx-auto"
                                        size={"full"}
                                        isFeatured={true}
                                    />
                                    <Skeleton className="h-8 mt-4 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {!isMobileView && (
                    <div className="w-[10%] space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                )}
            </div>
        </MaxWidthWrapper>
    );
};

export default CategoriesSkeleton;
