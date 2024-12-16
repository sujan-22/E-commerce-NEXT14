import { IAddress } from "@/data/types/address";

export const AddressAPI = async (
    action: "add" | "update" | "remove" | "get",
    userId: string,
    addressId?: string,
    newAddress?: IAddress
) => {
    try {
        const res = await fetch("/api/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                userId,
                addressId,
                newAddress,
            }),
        });

        if (!res.ok) {
            throw new Error(`Failed to ${action} address`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error during ${action} address:`, error);
        throw error;
    }
};
