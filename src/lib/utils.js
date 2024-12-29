import useStore from "@/context/useStore";
import { Currency } from "@/data/countries";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function useFormatPrice() {
    const country = useStore((state) => state.country);

    // Function to format and convert prices
    const formatPrice = (price) => {
        const numericPrice =
            typeof price === "string" ? parseFloat(price) : price;
        const currency = Currency[country] || "CAD";

        // Convert price based on currency
        const convertedPrice = numericPrice * (conversionRates[currency] || 1);

        // Format price without using Intl's currency symbol
        const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 2,
        }).format(convertedPrice);

        return `${currency}${formattedPrice}`;
    };

    return { formatPrice };
}
