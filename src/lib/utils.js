import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price) {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 2,
    }).format(numericPrice);
}
