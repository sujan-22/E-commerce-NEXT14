import { IAddress } from "@/data/types/address";
import { AddressAPI } from "@/lib/address-utils/AddressAPI";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AddressState {
    addresses: IAddress[];
    selectedAddress: IAddress | null;
    addAddress: (newAddress: IAddress, userId: string) => Promise<void>;
    updateAddress: (updatedAddress: IAddress, userId: string) => Promise<void>;
    removeAddress: (addressId: string, userId: string) => Promise<void>;
    getAllAddresses: (userId: string) => Promise<void>;
    getAddressById: (userId: string, addressId: string) => Promise<void>;
    setAllAddresses: (allAddresses: IAddress[]) => void;
    setSelectedAddress: (address: IAddress) => void;
    removeSelectedAddress: () => void;
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set, get) => ({
            addresses: [],
            selectedAddress: null,

            getAllAddresses: async (userId: string) => {
                try {
                    const data = await AddressAPI("get", userId);
                    // const res = await fetch("/api/address", {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify({
                    //         action: "get",
                    //         userId,
                    //     }),
                    // });

                    // if (!res.ok) {
                    //     throw new Error("Failed to fetch addresses");
                    // }

                    // const data = await res.json();
                    set({ addresses: data });
                } catch (error) {
                    console.error("Error fetching addresses:", error);
                }
            },

            getAddressById: async (userId, addressId) => {
                try {
                    const data = await AddressAPI("get", userId, addressId);
                    // const res = await fetch("/api/address", {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify({
                    //         action: "get",
                    //         userId,
                    //         addressId,
                    //     }),
                    // });

                    // if (!res.ok) {
                    //     throw new Error("Failed to fetch addresses");
                    // }

                    // const data = await res.json();
                    set({ addresses: data });
                } catch (error) {
                    console.error("Error fetching addresses:", error);
                }
            },

            addAddress: async (newAddress, userId) => {
                try {
                    await AddressAPI("add", userId, undefined, newAddress);
                    // const response = await fetch("/api/address", {
                    //     method: "POST",
                    //     headers: { "Content-Type": "application/json" },
                    //     body: JSON.stringify({
                    //         action: "add",
                    //         userId,
                    //         newAddress,
                    //     }),
                    // });

                    // if (!response.ok) throw new Error("Failed to add address");

                    // const addedAddress = await response.json();
                    // set((state) => ({
                    //     addresses: [...state.addresses, addedAddress],
                    //     selectedAddress: addedAddress,
                    // }));
                    get().getAllAddresses(userId);
                } catch (error) {
                    console.error("Error adding address:", error);
                }
            },

            // Update an existing address
            updateAddress: async (updatedAddress, userId) => {
                try {
                    await AddressAPI(
                        "update",
                        userId,
                        updatedAddress.addressId,
                        updatedAddress
                    );
                    // const response = await fetch("/api/address", {
                    //   method: "POST",
                    //   headers: { "Content-Type": "application/json" },
                    //   body: JSON.stringify({
                    //     action: "update",
                    //     userId,
                    //     addressId: updatedAddress.addressId,
                    //     newAddress: updatedAddress,
                    //   }),
                    // });

                    //   if (!response.ok)
                    //       throw new Error("Failed to update address");

                    //   set((state) => ({
                    //       addresses: state.addresses.map((address) =>
                    //           address.addressId === updatedAddress.addressId
                    //               ? { ...address, ...updatedAddress }
                    //               : address
                    //       ),
                    //   }));
                    get().getAllAddresses(userId);
                } catch (error) {
                    console.error("Error updating address:", error);
                }
            },

            // Remove an address
            removeAddress: async (addressId, userId) => {
                try {
                    await AddressAPI("remove", userId, addressId);
                    // const response = await fetch("/api/address", {
                    //     method: "POST",
                    //     headers: { "Content-Type": "application/json" },
                    //     body: JSON.stringify({
                    //         action: "remove",
                    //         userId,
                    //         addressId,
                    //     }),
                    // });

                    // if (!response.ok)
                    //     throw new Error("Failed to remove address");
                    get().getAllAddresses(userId);
                } catch (error) {
                    console.error("Error removing address:", error);
                }
            },

            // Set all addresses at once
            setAllAddresses: (allAddresses) => {
                set(() => ({
                    addresses: allAddresses,
                }));
            },

            // Set selected address
            setSelectedAddress: (address) => {
                set({ selectedAddress: address });
            },
            removeSelectedAddress: () => {
                set({ selectedAddress: null });
            },
        }),
        {
            name: "address-store", // Store name
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedAddress: state.selectedAddress, // Persist only selectedAddress
            }),
        }
    )
);
