import { IAddress } from "@/data/types/address";

const RenderUserSelectedAddress = ({ address }: { address: IAddress }) => {
    return (
        <div className="p-4 border border-gray-400 rounded-lg shadow-sm">
            <p className="font-semibold text-sm">
                {address.firstName} {address.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{address.address}</p>
            <p className="text-sm text-muted-foreground">
                {address.city}, {address.province} {address.postalCode}
            </p>
            <p className="text-sm text-muted-foreground">{address.country}</p>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
            <p className="text-sm text-muted-foreground">{address.email}</p>
        </div>
    );
};
export default RenderUserSelectedAddress;
