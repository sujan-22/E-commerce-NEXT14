import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/modules/AddressForm";
import { useAddressStore } from "@/context/useAddressStore";
import useStore from "@/context/useStore";
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

const Addresses = () => {
  const searchParams = useSearchParams();
  const {
    addresses,
    fetchAddresses,
    setSelectedAddress,
    selectedAddress,
    removeSelectedAddress,
    addAddress,
  } = useAddressStore();
  const { userData } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasFetchedAddresses, setHasFetchedAddresses] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      if (userData?.id) {
        try {
          await fetchAddresses(userData.id);
          setHasFetchedAddresses(true); // Mark as fetched
        } catch (error) {
          console.log(error);

          setIsError(true);
        } finally {
          setLoading(false); // Stop loading once it's finished
        }
      } else {
        setLoading(false); // No userData.id, no need to fetch
      }
    };

    loadAddresses();
  }, [fetchAddresses, userData?.id]);

  const isOpen = searchParams.get("step") === "address";

  const handleEdit = () => {
    removeSelectedAddress();
    router.push(pathname + "?step=address");
  };

  const validateAddress = (address: IAddress) => {
    try {
      AddressSchema.parse(address); // Will throw an error if invalid
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleContinue = async () => {
    const isValid = validateAddress(shippingAddress);
    if (isValid) {
      await addAddress(shippingAddress, userData!.id);
      router.push(pathname + "?step=delivery");
    } else {
      alert("Please fill in all required fields correctly.");
    }
  };

  const handleAddressSelect = (address: IAddress) => {
    setSelectedAddress(address);
  };

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<IAddress>({
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    phone: "",
    province: "",
    addressName: "",
  });

  const toggleSameAsBilling = () => {
    setSameAsBilling((prev) => !prev);
  };

  const renderAddressForm = (addressType: "billing" | "shipping") => (
    <AddressForm
      addressType={addressType}
      address={shippingAddress}
      setShippingAddress={setShippingAddress}
    />
  );

  const renderContinueAndBillingAndCheckbox = () => (
    <div className="pb-8">
      <div className="col-span-2 my-4 flex items-center gap-2">
        <Checkbox
          onClick={toggleSameAsBilling}
          checked={sameAsBilling}
          id="billing-checkbox"
        />
        <label htmlFor="billing-checkbox" className="text-sm">
          Billing address same as shipping address
        </label>
      </div>

      {!sameAsBilling && (
        <div className="mb-4">
          <AddressForm
            addressType="billing"
            address={shippingAddress}
            setShippingAddress={setShippingAddress}
          />
        </div>
      )}
      <Button onClick={handleContinue} type="submit">
        Continue to delivery
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
        <h4 className="text-sm font-semibold underline">Add new address?</h4>
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
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-2">
        <h2
          className={`text-lg font-bold flex items-center ${
            !isOpen ? "text-muted-foreground" : ""
          }`}
        >
          Shipping Address
          {selectedAddress && <IoCheckmarkCircle className="ml-2 w-4 h-4" />}
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
            // Show loader if still fetching
            <SyncLoader size={10} margin={2} />
          ) : isError ? (
            <div>Error fetching addresses. Please try again later.</div>
          ) : !hasFetchedAddresses ? (
            // Show loader until addresses have been fetched
            <SyncLoader size={10} margin={2} />
          ) : addresses.length === 0 ? (
            // Show AddressForm if no addresses are available
            <>
              <AddressForm
                addressType="shipping"
                address={shippingAddress}
                setShippingAddress={setShippingAddress}
              />
              {renderContinueAndBillingAndCheckbox()}
            </>
          ) : (
            <>
              <RenderAddress
                addresses={addresses}
                onSelectAddress={handleAddressSelect}
              />
              <div className=" mt-2">{renderCollapsibleSection()}</div>
              {renderContinueAndBillingAndCheckbox()}
            </>
          )}
        </div>
      ) : (
        <div>
          <RenderAddress
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={handleAddressSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Addresses;
