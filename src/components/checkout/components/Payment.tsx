"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { useState } from "react";
import PaymentComponent from "@/components/payment";

const Payment = () => {
    const searchParams = useSearchParams();
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "payment";

    const handleEdit = () => {
        router.push(`${pathname}?step=payment`, { scroll: false });
    };

    const handleSubmit = () => {
        setIsPaid(true);
        router.push(`${pathname}?step=payment`, { scroll: false });
    };

    return (
        <div>
            <div className="flex flex-row items-center justify-between mb-2">
                <h2
                    className={`text-lg font-semibold flex items-center ${
                        !isOpen ? "text-muted-foreground" : ""
                    }`}
                >
                    Payment
                    {isPaid && <IoCheckmarkCircle className="ml-2 w-4 h-4" />}
                </h2>
                {!isOpen && isPaid && (
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
                                    readOnly
                                />
                                <Label className="cursor-pointer text-md">
                                    Test Payment
                                </Label>
                                <PaymentComponent />
                            </div>
                            <span className="text-md font-medium">
                                <HiOutlineCreditCard />
                            </span>
                        </div>
                    </div>
                    <Button onClick={handleSubmit}>Place an Order</Button>
                </div>
            ) : (
                isPaid && (
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
                )
            )}
        </div>
    );
};

export default Payment;
