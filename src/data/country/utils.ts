"use client";

import { useRouter } from "next/navigation";

export function useUpdateRegion() {
    const router = useRouter();

    return (newCountryCode: string, currentPath: string) => {
        // Build the new path by replacing the country code
        const pathSegments = currentPath.split("/");
        pathSegments[1] = newCountryCode; // Replace the countryCode at index 1
        const newPath = pathSegments.join("/");

        router.push(newPath); // Navigate to the new path
    };
}
