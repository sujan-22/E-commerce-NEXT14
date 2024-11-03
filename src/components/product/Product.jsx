/* eslint-disable jsx-a11y/alt-text */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

const Product = ({ size, isFeatured, initialImage, className }) => {
    return (
        <div
            className={cn(
                "relative w-full overflow-hidden p-2 transition-shadow ease-in-out duration-150 border rounded-md bg-gray-100",
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
        >
            <ImageOrPlaceholder image={initialImage} />
        </div>
    );
};

export const ImageOrPlaceholder = ({ image }) => {
    return (
        <Image
            src={image}
            alt="Thumbnail"
            className="absolute inset-0 object-cover object-center  transform transition-transform duration-300 hover:scale-[1.05]"
            draggable={false}
            quality="100"
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            fill
        />
    );
};

export default Product;
