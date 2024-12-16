"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Review = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [isChecked, setIsChecked] = useState(false);

    const isOpen = searchParams.get("step") === "review";

    const handleEdit = () => {
        router.push(`${pathname}?step=review`, { scroll: false });
    };

    const handleSubmit = () => {
        setIsChecked(true);
        router.push(`${pathname}?step=payment`, { scroll: false });
    };

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-2">
                <h2
                    className={`text-lg font-semibold flex items-center ${
                        !isOpen ? "text-muted-foreground" : ""
                    }`}
                >
                    Review
                </h2>
                {!isOpen && isChecked && (
                    <Button
                        variant={"link"}
                        className="text-blue-600"
                        onClick={handleEdit}
                    >
                        View
                    </Button>
                )}
            </div>
            {isOpen && (
                <div data-testid="delivery-options-container">
                    <div className="pb-8 text-sm">
                        By clicking &quot;Continue to Payment&quot;, you confirm
                        that you have reviewed your order and agree to our Terms
                        of Use, Terms of Sale, Returns Policy, and Privacy
                        Policy. You acknowledge that you are ready to proceed
                        with the payment for your order.
                    </div>

                    {/* Checkbox for Terms and Conditions */}
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                            id="terms"
                            checked={isChecked}
                            onClick={() => setIsChecked((prev) => !prev)}
                            className="h-4 w-4"
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none cursor-pointer"
                        >
                            I agree to the terms and conditions
                        </label>
                    </div>

                    {/* Continue to Payment Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isChecked}
                        className="mt-4"
                    >
                        Continue to Payment
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Review;
