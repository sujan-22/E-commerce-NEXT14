import { IAddress } from "@/data/types/address";
import { useState } from "react";
import { Label } from "@/components/ui/label"; // Adjust if needed

const RenderAddress = ({
    addresses,
    selectedAddress,
    onSelectAddress,
}: {
    addresses: IAddress[];
    selectedAddress?: IAddress | null;
    onSelectAddress: (address: IAddress) => void;
}) => {
    const [currentAddress, setCurrentAddress] = useState<string | null>(null);

    const handleSelect = (address: IAddress) => {
        setCurrentAddress(address.addressId!);
        onSelectAddress(address);
    };

    if (addresses.length === 1 || selectedAddress) {
        const address = selectedAddress ?? addresses[0];
        return (
            <div className="p-4 border border-muted rounded-lg shadow-sm">
                <p className="font-semibold text-lg">
                    {address.firstName} {address.lastName}
                </p>
                <p className="text-sm text-gray-600">{address.address}</p>
                <p className="text-sm text-gray-600">
                    {address.city}, {address.province} {address.postalCode}
                </p>
                <p className="text-sm text-gray-600">{address.country}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
            </div>
        );
    }

    // If there are multiple addresses, display them as radio buttons
    return (
        <div className="space-y-4">
            {addresses?.map((address) => (
                <div
                    key={address.addressId}
                    className={`flex items-center justify-between p-4 mb-2 border rounded-lg cursor-pointer ${
                        currentAddress === address.addressId
                            ? "border-primary"
                            : "border-muted"
                    }`}
                    onClick={() => handleSelect(address)}
                >
                    <div className="flex items-center gap-x-4">
                        <input
                            type="radio"
                            id={address.addressId}
                            name="address"
                            checked={currentAddress === address.addressId}
                            onChange={() => handleSelect(address)}
                            className="w-4 h-4 cursor-pointer text-primary"
                        />
                        <Label
                            htmlFor={address.addressId}
                            className="cursor-pointer text-md"
                        >
                            {address.firstName} {address.lastName} -{" "}
                            {address.addressName}
                        </Label>
                    </div>
                    <div className="text-md font-medium">
                        <p>{address.address}</p>
                        <p>
                            {address.city}, {address.province}{" "}
                            {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                        <p>{address.phone}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RenderAddress;
