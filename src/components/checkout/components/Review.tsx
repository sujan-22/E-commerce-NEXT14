"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Review = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "review";

    const handleEdit = () => {
        router.push(`${pathname}?step=payment`, { scroll: false });
    };

    const handleSubmit = () => {
        router.push(`${pathname}?step=review`, { scroll: false });
    };

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-2">
                <h2 className="text-lg font-bold flex items-center">Review</h2>
                {!isOpen && (
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
                        By clicking the Place Order button, you confirm that you
                        have read, understand and accept our Terms of Use, Terms
                        of Sale and Returns Policy and acknowledge that you have
                        read our store&apos;s Privacy Policy.
                    </div>
                    <Button onClick={handleSubmit}>Place Order</Button>
                </div>
            )}
        </div>
    );
};

export default Review;
