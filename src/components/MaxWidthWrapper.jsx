import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({ className, children }) => {
    return (
        <div
            className={cn(
                " h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                className
            )}
        >
            {children}
        </div>
    );
};

export default MaxWidthWrapper;
