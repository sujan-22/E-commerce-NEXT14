import React from "react";
import Addresses from "../components/Addresses";
import Shipping from "../components/Shipping";
import Payment from "../components/Payment";
import Review from "../components/Review";
import { Separator } from "@/components/ui/separator";

const CheckoutForm = () => {
  return (
    <div>
      <div className="w-full h-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses />
        </div>
        <Separator />
        <div>
          <Shipping />
        </div>
        <Separator />
        <div>
          <Review />
        </div>
        <Separator />
        <div>
          <Payment />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
