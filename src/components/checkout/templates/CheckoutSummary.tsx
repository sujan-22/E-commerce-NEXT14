"use client";
import { Separator } from "@/components/ui/separator";
import { useDeliveryStore } from "@/context/useDeliveryStore";
import useStore from "@/context/useStore";
import { useFormatPrice } from "@/lib/utils";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const CheckoutSummary = ({
  shouldDisplayTaxText,
  shouldDisplayTooltip,
}: {
  shouldDisplayTaxText?: boolean;
  shouldDisplayTooltip?: boolean;
}) => {
  const { cartTotal } = useStore();
  const { formatPrice } = useFormatPrice();
  const { deliveryOption } = useDeliveryStore();
  const deliveryPrice = deliveryOption?.charge ?? 0.0;
  const totalPrice = cartTotal + deliveryPrice;
  return (
    <div>
      <h2 className="text-xl mb-4 font-semibold">Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <>
            <div className="flex items-center space-x-2">
              <p>Subtotal</p>
              {shouldDisplayTooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cart total excluding shipping and taxes.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </>

          <p>{formatPrice(cartTotal)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>{formatPrice(deliveryPrice)}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax</p>
          <p>
            {shouldDisplayTaxText ? <>To be calculated</> : formatPrice(0.0)}
          </p>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <p>Total</p>
          <p>{formatPrice(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
