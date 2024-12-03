import React from "react";
import { Input } from "@/components/ui/input"; // Shadcn Input component
import { Checkbox } from "@/components/ui/checkbox"; // Shadcn Checkbox component
import { Button } from "@/components/ui/button"; // Shadcn Button component
import Image from "next/image";

const CheckoutPage = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 p-8">
      {/* Left Column: Shipping Address */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Fields */}
          <Input placeholder="First name*" required />
          <Input placeholder="Last name*" required />
          <Input placeholder="Address*" required />
          <Input placeholder="Company" />
          <Input placeholder="City*" required />
          <Input placeholder="Postal code*" required />
          <Input placeholder="Country*" required />
          <Input placeholder="State / Province*" required />
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox id="billing-checkbox" />
            <label htmlFor="billing-checkbox" className="text-sm">
              Billing address same as shipping address
            </label>
          </div>
          <Input placeholder="Email*" type="email" required />
          <Input placeholder="Phone" />
          <Button type="submit" className="w-full col-span-2">
            Continue to delivery
          </Button>
        </form>
      </div>

      <div className="w-full lg:w-1/3">
        <h2 className="text-xl font-bold mb-4">In your Cart</h2>
        <div className="p-4 rounded-md space-y-4">
          {/* Subtotal, Shipping, Taxes */}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$199.00</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>$0.00</span>
          </div>
          <hr className="border-t" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>$199.00</span>
          </div>

          <div className="flex items-center gap-4 border-t pt-4">
            <Image
              width={64}
              height={64}
              src="/path-to-image.jpg"
              alt="Product Image"
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">Decibel Dominator Deluxe</h3>
              <p className="text-sm text-gray-600">Variant: Black</p>
              <p className="font-bold">$199.00</p>
            </div>
          </div>
          <div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Add gift card or discount code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
