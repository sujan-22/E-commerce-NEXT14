import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function useFormatPrice() {
    const formatPrice = (price) => {
        const numericPrice =
            typeof price === "string" ? parseFloat(price) : price;
        const currency = "CAD";

        const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 2,
        }).format(numericPrice);

        return `${currency}${formattedPrice}`;
    };

    return { formatPrice };
}
