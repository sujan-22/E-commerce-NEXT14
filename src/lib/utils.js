import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price, options) {
    const { currency = "CAD", notation = "compact" } = options;
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation,
        maximumFractionDigits: 2,
    }).format(numericPrice);
}
