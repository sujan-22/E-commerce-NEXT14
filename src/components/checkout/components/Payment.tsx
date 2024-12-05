"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiOutlineCreditCard } from "react-icons/hi2";

const Payment = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "payment";

    const handleEdit = () => {
        router.push(`${pathname}?step=payment`, { scroll: false });
    };

    const handleSubmit = () => {
        router.push(`${pathname}?step=review`, { scroll: false });
    };

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-2">
                <h2 className="text-lg font-bold flex items-center">
                    Payment
                    <IoCheckmarkCircle className="ml-2 w-4 h-4" />
                </h2>
                {!isOpen && (
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
                <div data-testid="delivery-options-container">
                    <div className="pb-8">
                        <div
                            className={
                                "flex items-center justify-between p-4 mb-2 border rounded-lg cursor-pointer border-primary"
                            }
                        >
                            <div className="flex items-center gap-x-4">
                                <input
                                    type="radio"
                                    name="delivery"
                                    checked={true}
                                    className="w-4 h-4 cursor-pointer text-primary"
                                />
                                <Label className="cursor-pointer text-md">
                                    Test Payment
                                </Label>
                            </div>
                            <span className="text-md font-medium">
                                <HiOutlineCreditCard />
                            </span>
                        </div>
                    </div>
                    <Button onClick={handleSubmit}>Continue to review</Button>
                </div>
            ) : (
                <div>
                    <div className="text-md">
                        <div className="flex flex-col">
                            <div className="p-4 border border-gray-400 rounded-lg shadow-sm">
                                <p className="text-sm font-semibold">
                                    Test Payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
