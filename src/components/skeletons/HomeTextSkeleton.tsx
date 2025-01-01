import React from "react";
import { Skeleton } from "../ui/skeleton";

const HomeTextSkeleton = () => {
    return (
        <div>
            <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl pt-[160px]">
                {/* Skeleton for heading */}
                <Skeleton className="h-8 sm:h-12 w-11/12 sm:w-2/3" />
                <Skeleton className="h-8 sm:h-12 w-11/12 mt-2" />

                {/* Skeleton for paragraph */}
                <div className="mt-6 flex flex-col gap-3 w-full max-w-prose">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Skeleton for buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
                    <Skeleton className="h-10 w-60" />
                    <Skeleton className="h-10 w-60" />
                </div>
            </div>
        </div>
    );
};

export default HomeTextSkeleton;
