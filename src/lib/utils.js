import useStore from "@/context/useStore";
import { Currency } from "@/data/countries";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const conversionRates = {
    USD: 0.75, // Example: 1 CAD = 0.75 USD
    INR: 61.0, // Example: 1 CAD = 61 INR
    CAD: 1.0, // 1 CAD = 1 CAD
};

export function useFormatPrice() {
    const country = useStore((state) => state.country);

    // Function to format and convert prices
    const formatPrice = (price) => {
        const numericPrice =
            typeof price === "string" ? parseFloat(price) : price;
        const currency = Currency[country] || "CAD";

        // Convert price based on currency
        const convertedPrice = numericPrice * (conversionRates[currency] || 1);

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 2,
        }).format(convertedPrice);
    };

    return { formatPrice };
}
