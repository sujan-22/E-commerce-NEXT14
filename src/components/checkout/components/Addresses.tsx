import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/modules/AddressForm";
import { useAddressStore } from "@/context/useAddressStore";
import RenderAddress from "@/components/modules/RenderAddress";
import { SyncLoader } from "react-spinners";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Minus, Plus } from "lucide-react";
import { IAddress } from "@/data/types/address";
import { AddressSchema } from "@/lib/validationSchema";
import useUserStore from "@/context/useUserStore";
import RenderUserSelectedAddress from "@/components/modules/RenderUserSelectedAddress";

const Addresses = () => {
    const searchParams = useSearchParams();
    const { currentUser } = useUserStore();

    const fName = currentUser && currentUser!.name.split(" ")[0];
    const lName = currentUser && currentUser!.name.split(" ")[1];
    const email = currentUser && currentUser?.email;

    const [shippingAddress, setShippingAddress] = useState<IAddress>({
        firstName: fName || "",
        email: email || "",
        lastName: lName || "",
        address: "",
        postalCode: "",
        city: "",
        country: "Canada",
        phone: "",
        province: "",
        addressName: "",
    });
    const {
        addresses,
        getAllAddresses,
        selectedAddress,
        removeSelectedAddress,
        addAddress,
    } = useAddressStore();

    const router = useRouter();
    const pathname = usePathname();
    const [open, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [hasFetchedAddresses, setHasFetchedAddresses] = useState(false);

    useEffect(() => {
        const loadAddresses = async () => {
            if (currentUser?.id) {
                try {
                    await getAllAddresses(currentUser.id);
                    setHasFetchedAddresses(true);
                } catch (error) {
                    console.log(error);

                    setIsError(true);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadAddresses();
    }, [getAllAddresses, currentUser?.id]);

    const isOpen = searchParams.get("step") === "address";

    const handleEdit = () => {
        router.push(pathname + "?step=address");
        removeSelectedAddress();
    };

    const validateAddress = (address: IAddress) => {
        try {
            AddressSchema.parse(address);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleContinue = async () => {
        if (!open && addresses.length !== 0) {
            router.push(pathname + "?step=delivery");
        } else {
            const isValid = validateAddress(shippingAddress);

            if (isValid) {
                await addAddress(shippingAddress, currentUser!.id);
                setIsOpen(false);
                setShippingAddress({
                    firstName: fName || "",
                    email: email || "",
                    lastName: lName || "",
                    address: "",
                    postalCode: "",
                    city: "",
                    country: "Canada",
                    phone: "",
                    province: "",
                    addressName: "",
                });
            } else {
                alert("Please fill in all required fields correctly.");
            }
        }
    };

    const renderAddressForm = (addressType: "shipping") => (
        <AddressForm
            addressType={addressType}
            address={shippingAddress}
            setShippingAddress={setShippingAddress}
        />
    );

    const renderContinueButton = () => (
        <div className="py-8">
            <Button onClick={handleContinue} type="submit">
                {open || addresses.length === 0
                    ? "Add Address"
                    : "Continue to Delivery"}
            </Button>
        </div>
    );

    const renderCollapsibleSection = () => (
        <Collapsible
            open={open}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
        >
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold underline">
                    Add new address?
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">
                        {!open ? (
                            <Plus className="h-4 w-4" />
                        ) : (
                            <Minus className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
                {renderAddressForm("shipping")}
            </CollapsibleContent>
        </Collapsible>
    );

    return (
        <div>
            <div className="flex flex-row items-center justify-between mb-2">
                <h2
                    className={`text-lg font-semibold flex items-center ${
                        !isOpen ? "text-muted-foreground" : ""
                    }`}
                >
                    Shipping Address
                    {selectedAddress && (
                        <IoCheckmarkCircle className="ml-2 w-4 h-4" />
                    )}
                </h2>
                {!isOpen && selectedAddress && (
                    <Button
                        variant={"link"}
                        className="text-blue-600"
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                )}
            </div>

            {isOpen ? (
                <div>
                    {loading ? (
                        <SyncLoader size={10} margin={2} />
                    ) : isError ? (
                        <div>
                            Error fetching addresses. Please try again later.
                        </div>
                    ) : !hasFetchedAddresses ? (
                        <SyncLoader size={10} margin={2} />
                    ) : addresses.length === 0 ? (
                        <>
                            <AddressForm
                                addressType="shipping"
                                address={shippingAddress}
                                setShippingAddress={setShippingAddress}
                            />
                            {renderContinueButton()}
                        </>
                    ) : (
                        <>
                            <RenderAddress addresses={addresses} />
                            <div className=" mt-2">
                                {renderCollapsibleSection()}
                            </div>
                            {renderContinueButton()}
                        </>
                    )}
                </div>
            ) : (
                <div>
                    {selectedAddress && (
                        <RenderUserSelectedAddress address={selectedAddress!} />
                    )}
                    {/* <RenderAddress
                        addresses={addresses}
                        currentAddress={selectedAddress}
                    /> */}
                </div>
            )}
        </div>
    );
};

export default Addresses;
