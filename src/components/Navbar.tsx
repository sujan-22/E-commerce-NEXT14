/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense } from "react";
import Cart from "./cart/Cart";
import SideMenu from "./SideMenu";
import LocalizedClientLink from "@/lib/LocalizedClientLink";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Dialogbox from "./Dialogbox";
import useStore from "@/context/useStore";
import { Button } from "./ui/button";
import { handleSignOut } from "@/app/actions/authActions";

const Navbar = () => {
    const userData = useStore((state) => state.userData);
    console.log(userData);
    const logoutUser = useStore((state) => state.logoutUser); // Access logoutUser function from Zustand store

    // Function to handle sign-out and clear state
    const handleLogout = () => {
        logoutUser(); // Clear the state from Zustand
        handleSignOut(); // Call the signOut method from NextAuth
    };

    return (
        <div className="sticky top-0 inset-x-0 z-50 \\">
            <div className="sticky top-0 inset-x-0 z-50 \\">
                <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
                    <MaxWidthWrapper>
                        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
                            <div className="flex-1 basis-0 h-full flex items-center">
                                <div className="h-full">
                                    <SideMenu />
                                </div>
                            </div>

                            <div className="flex items-center h-full">
                                <LocalizedClientLink
                                    href="/"
                                    className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
                                    data-testid="nav-store-link"
                                >
                                    Medusa Store
                                </LocalizedClientLink>
                            </div>

                            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
                                <div className="hidden small:flex items-center gap-x-6 h-full">
                                    {process.env
                                        .NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                                        <LocalizedClientLink
                                            className="hover:text-ui-fg-base"
                                            href="/search"
                                            // scroll={false}
                                            data-testid="nav-search-link"
                                        >
                                            Search
                                        </LocalizedClientLink>
                                    )}
                                    <LocalizedClientLink
                                        className="hover:text-ui-fg-base"
                                        href="/account"
                                        data-testid="nav-account-link"
                                    >
                                        Account
                                    </LocalizedClientLink>
                                </div>
                                <Suspense
                                    fallback={
                                        <LocalizedClientLink
                                            className="hover:text-ui-fg-base flex gap-2"
                                            href="/cart"
                                            data-testid="nav-cart-link"
                                        >
                                            Cart (0)
                                        </LocalizedClientLink>
                                    }
                                >
                                    <Cart />
                                </Suspense>
                                <div>
                                    {userData ? (
                                        <Button
                                            variant={"outline"}
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </Button>
                                    ) : (
                                        <Dialogbox />
                                    )}
                                </div>
                            </div>
                        </nav>
                    </MaxWidthWrapper>
                </header>
            </div>
        </div>
    );
};

export default Navbar;
