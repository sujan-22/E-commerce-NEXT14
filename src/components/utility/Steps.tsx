"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ImageIcon, Info } from "lucide-react";

const STEPS = [
    {
        name: "Step 1: Upload Image(s)",
        description:
            "Select one or more images that best showcase your product.",
        path: "/upload",
        icon: ImageIcon,
    },
    {
        name: "Step 2: Add Product Details",
        description:
            "Fill in the essential details like name, category, price, and stock.",
        path: "/details",
        icon: Info,
    },
    // {
    //     name: "Step 3: Review and Confirm",
    //     description:
    //         "Double-check your information and confirm product details before submission.",
    //     path: "/preview",
    //     icon: Info, // Consider replacing with a unique icon if available
    // },
];

const Steps = () => {
    const pathName = usePathname();

    return (
        <ol className=" rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
            {STEPS.map((step, i) => {
                const isActive = pathName.endsWith(step.path);
                const isCompleted = STEPS.slice(i + 1).some((step) =>
                    pathName.endsWith(step.path)
                );

                return (
                    <li key={i} className="relative overflow-hidden lg:flex-1">
                        <div>
                            <span
                                className={cn(
                                    "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:blur-0 lg:top-auto lg:h-1 lg:w-full",
                                    {
                                        "bg-zinc-700": isActive,
                                        "bg-primary": isCompleted,
                                    }
                                )}
                                aria-hidden="true"
                            />
                            <span
                                className={cn(
                                    i !== 0 ? "lg:pl-9" : "",
                                    "flex items-center px-6 py-4 text-sm font-medium"
                                )}
                            >
                                <span className="flex-shrink-0">
                                    {/* <CustomImage
                                        src={imgPath}
                                        alt=""
                                        className={cn(
                                            "flex h-20 w-20 object-contain items-center justify-center",
                                            {
                                                "border-none": isCompleted,
                                                "border-zinc-700": isActive,
                                            }
                                        )}
                                    /> */}
                                    <step.icon
                                        size={40}
                                        className="flex object-contain items-center justify-center"
                                    />
                                </span>
                                <span className=" ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                                    <span
                                        className={cn(
                                            "text-sm font-semibold text-zinc-700",
                                            {
                                                "text-primary": isCompleted,
                                                "text-zinc-700": isActive,
                                            }
                                        )}
                                    >
                                        {step.name}
                                    </span>
                                    <span className="text-sm text-zinc-500">
                                        {step.description}
                                    </span>
                                </span>
                            </span>

                            {/* separator */}
                            {i !== 0 ? (
                                <div className="absolute inset-0 hidden w-3 lg:block">
                                    <svg
                                        className="h-full w-full text-muted-foreground"
                                        viewBox="0 0 12 82"
                                        fill="none"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M0.5 0V31L10.5 41L0.5 51V82"
                                            stroke="currentcolor"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                </div>
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};

export default Steps;
