"use client";

import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import CheckoutSummary from "@/components/checkout/templates/CheckoutSummary";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartLines from "@/components/cart/components/CartLines";
import useUserStore from "@/context/useUserStore";
import AuthDialog from "@/components/auth/AuthDialog";
import { useState } from "react";
import Link from "next/link";

const CartPage = () => {
    const { currentUser } = useUserStore();
    const [isDialogOpen, setDialogOpen] = useState(false);

    return (
        <MaxWidthWrapper>
            <div className="flex flex-col lg:flex-row justify-between gap-10 py-8">
                <ScrollArea className="w-full">
                    <div className="flex-1 max-h-[80vh]">
                        <CartLines />
                    </div>
                </ScrollArea>
                <div className="w-full lg:w-1/3">
                    <CheckoutSummary
                        shouldDisplayTaxText
                        shouldDisplayTooltip
                    />

                    {!currentUser ? (
                        <div>
                            <Button
                                onClick={() => setDialogOpen(true)}
                                className="w-full mt-4"
                            >
                                Sign in to Continue
                            </Button>
                        </div>
                    ) : (
                        <Link href="/checkout?step=address">
                            <Button
                                disabled={!currentUser}
                                className="w-full mt-4"
                            >
                                Proceed to Checkout
                            </Button>
                        </Link>
                    )}
                    <AuthDialog
                        isDialogOpen={isDialogOpen}
                        setDialogOpen={setDialogOpen}
                        redirectTo="/checkout?step=address"
                    />
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default CartPage;
