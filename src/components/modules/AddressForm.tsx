"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";

interface Address {
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone?: string;
    company?: string;
    email: string;
    province: string;
}

const AddressForm = ({
    address,
    handleAddressChange,
    addressType,
}: {
    address: Address;
    handleAddressChange: (
        e: ChangeEvent<HTMLInputElement>,
        addressType: "shipping" | "billing"
    ) => void;
    addressType: "shipping" | "billing";
}) => {
    return (
        <div className="space-y-4">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Fields */}
                <InputField
                    name="firstName"
                    placeholder="First Name*"
                    value={address.firstName}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    name="lastName"
                    placeholder="Last Name*"
                    value={address.lastName}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    name="address"
                    placeholder="Address*"
                    value={address.address}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    name="company"
                    placeholder="Company"
                    value={address.company || ""}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    placeholder="City*"
                    name="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    placeholder="Postal code*"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    placeholder="Country*"
                    name="country"
                    value={address.country}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />
                <InputField
                    placeholder="State / Province*"
                    name="province"
                    value={address.province}
                    onChange={(e) => handleAddressChange(e, "shipping")}
                />

                {addressType === "billing" && (
                    <>
                        <InputField
                            placeholder="Email*"
                            name="email"
                            value={address.email}
                            onChange={(e) => handleAddressChange(e, "shipping")}
                        />
                        <Input
                            name="phone"
                            placeholder="Phone"
                            value={address.phone || ""}
                            onChange={(e) =>
                                handleAddressChange(e, addressType)
                            }
                        />
                    </>
                )}
            </form>
        </div>
    );
};

export default AddressForm;
