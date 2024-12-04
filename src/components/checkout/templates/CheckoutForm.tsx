// import useStore, { CartItem } from "@/context/useStore";
import React from "react";
import Addresses from "../components/Addresses";
import Shipping from "../components/Shipping";

const CheckoutForm = () => {
    // const cart = useStore((state) => state.cartItems);
    return (
        <div>
            <div className="w-full grid grid-cols-1 gap-y-8">
                <div>
                    <Addresses />
                </div>

                <div>
                    <Shipping />
                </div>
                {/* 
                <div>
                    <Payment
                        cart={cart}
                        availablePaymentMethods={paymentMethods}
                    />
                </div>

                <div>
                    <Review cart={cart} />
                </div> */}
            </div>
        </div>
    );
};

export default CheckoutForm;
