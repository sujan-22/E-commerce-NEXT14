import { IAddress } from "@/data/types/address";
import { Label } from "@/components/ui/label";
import { useAddressStore } from "@/context/useAddressStore";

const RenderAddress = ({ addresses }: { addresses: IAddress[] }) => {
    const { selectedAddress, setSelectedAddress } = useAddressStore();

    const handleSelect = (address: IAddress) => {
        setSelectedAddress(address);
    };
    return (
        <div className="space-y-4">
            {addresses?.map((address) => (
                <div
                    key={address.addressId}
                    className={`flex items-center justify-between p-4 mb-2 border rounded-lg cursor-pointer ${
                        selectedAddress?.addressName === address?.addressName
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
                            checked={
                                selectedAddress?.addressName ===
                                address.addressName
                            }
                            onChange={() => handleSelect(address)}
                            className="w-4 h-4 cursor-pointer text-primary"
                        />
                        <Label
                            htmlFor={address.addressId}
                            className="cursor-pointer text-sm"
                        >
                            {address.firstName} {address.lastName} -{" "}
                            {address.addressName}
                        </Label>
                    </div>
                    <div className="w-60 text-sm font-medium">
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
