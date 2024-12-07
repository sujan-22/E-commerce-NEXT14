import { IDeliveyOptions } from "@/components/checkout/components/Shipping";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DeliveryState {
  deliveryOption: IDeliveyOptions | null;
  setDeliveryOption: (option: IDeliveyOptions | null) => void;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      deliveryOption: null,
      setDeliveryOption: (option) => {
        set({ deliveryOption: option });
      },
    }),
    {
      name: "delivery-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        deliveryOption: state.deliveryOption,
      }),
    }
  )
);
