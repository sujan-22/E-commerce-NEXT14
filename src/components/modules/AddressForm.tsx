"use client";
import InputField from "./InputField";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import countries, { IAddress } from "@/data/types/address";

const AddressForm = ({
    address,
    setShippingAddress,
}: {
    address: IAddress;
    setShippingAddress: React.Dispatch<React.SetStateAction<IAddress>>;
    addressType: "shipping" | "billing";
}) => {
    // Get the regions for the selected country
    const countryData = countries.find((c) => c.label === address.country);
    const regions = countryData ? countryData.regions : [];

    return (
        <div className="space-y-4">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="addressName"
                    placeholder="Address Name*"
                    value={address.addressName}
                    onChange={(e) =>
                        setShippingAddress((prev) => ({
                            ...prev,
                            addressName: e.target.value,
                        }))
                    }
                />
                <InputField
                    name="firstName"
                    placeholder="First Name*"
                    value={address.firstName}
                    onChange={(e) =>
                        setShippingAddress((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                        }))
                    }
                />
                <InputField
                    name="lastName"
                    placeholder="Last Name*"
                    value={address.lastName}
                    onChange={(e) =>
                        setShippingAddress((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                        }))
                    }
                />
                <InputField
                    name="address"
                    placeholder="Address*"
                    value={address.address}
                    onChange={(e) =>
                        setShippingAddress((prev) => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                />
                <InputField
                    placeholder="City*"
                    name="city"
                    value={address.city}
                    onChange={(e) =>
                        setShippingAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                        }))
                    }
                />
                <InputField
                    placeholder="Postal code*"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={(e) =>
                        setShippingAddress((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                        }))
                    }
                />
                <div>
                    <Select
                        value={address.country}
                        onValueChange={(value) =>
                            setShippingAddress((prev) => ({
                                ...prev,
                                country: value,
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Country*" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Countries</SelectLabel>
                                {countries.map((country) => (
                                    <SelectItem
                                        key={country.label}
                                        value={country.label}
                                    >
                                        {country.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Province Select */}
                {address.country && (
                    <div>
                        <Select
                            value={address.province}
                            onValueChange={(value) =>
                                setShippingAddress((prev) => ({
                                    ...prev,
                                    province: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Province*" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Provinces</SelectLabel>
                                    {regions.map((region) => (
                                        <SelectItem
                                            key={region.label}
                                            value={region.label}
                                        >
                                            {region.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddressForm;
