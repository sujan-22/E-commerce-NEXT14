import { IDeliveyOptions } from "@/components/checkout/components/Shipping";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DeliveryState {
    deliveyOption: IDeliveyOptions | null;
    setDeliveryOption: (option: IDeliveyOptions | null) => void;
}

export const useDeliveryStore = create<DeliveryState>()(
    persist(
        (set) => ({
            deliveyOption: null,
            setDeliveryOption: (option) => {
                set({ deliveyOption: option });
            },
        }),
        {
            name: "delivery-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedAddress: state.deliveyOption,
            }),
        }
    )
);
