"use client";

import { Separator } from "@/components/ui/separator";
import { Spinner } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/modules/AddressForm";

const Addresses = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "address";

    const handleEdit = () => {
        router.push(pathname + "?step=address");
    };

    const handleContinue = () => {
        // Update the URL with the new step
        router.push(pathname + "?step=delivery");
    };

    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
        company: "",
        province: "",
        email: "",
    });

    const handleAddressChange = (
        e: ChangeEvent<HTMLInputElement>,
        addressType: "shipping" | "billing"
    ) => {
        const { name, value } = e.target;
        if (addressType === "shipping") {
            setShippingAddress((prev) => ({ ...prev, [name]: value }));
        }
    };

    const toggleSameAsBilling = () => {
        setSameAsBilling((prev) => !prev);
    };

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Shipping Address</h2>
                {!isOpen && (
                    <Button variant={"link"} onClick={handleEdit}>
                        Edit
                    </Button>
                )}
            </div>

            {isOpen ? (
                <div>
                    <div className="pb-8">
                        <AddressForm
                            addressType="shipping"
                            address={shippingAddress}
                            handleAddressChange={handleAddressChange}
                        />
                        <div className="col-span-2 my-4 flex items-center gap-2">
                            <Checkbox
                                onClick={toggleSameAsBilling}
                                checked={sameAsBilling}
                                id="billing-checkbox"
                            />
                            <label
                                htmlFor="billing-checkbox"
                                className="text-sm"
                            >
                                Billing address same as shipping address
                            </label>
                        </div>

                        {!sameAsBilling && (
                            <div className="mb-4">
                                <AddressForm
                                    addressType="billing"
                                    address={shippingAddress}
                                    handleAddressChange={handleAddressChange}
                                />
                            </div>
                        )}
                        <Button onClick={handleContinue} type="submit">
                            Continue to delivery
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    {shippingAddress.firstName ? (
                        <div>
                            <p>
                                {shippingAddress.firstName}{" "}
                                {shippingAddress.lastName}
                            </p>
                            <p>
                                {shippingAddress.company &&
                                    `${shippingAddress.company}, `}
                                {shippingAddress.address}
                            </p>
                            <p>
                                {shippingAddress.city},{" "}
                                {shippingAddress.province}{" "}
                                {shippingAddress.postalCode}
                            </p>
                            <p>{shippingAddress.country}</p>
                            <p>{shippingAddress.phone}</p>
                            <p>{shippingAddress.email}</p>
                        </div>
                    ) : (
                        <Spinner />
                    )}
                </div>
            )}
            <Separator className="mt-8" />
        </div>
    );
};

export default Addresses;
