"use client";

import Cart from "../cart/Cart";
import SideMenu from "./SideMenu";
import Link from "next/link";
import MaxWidthWrapper from "../utility/MaxWidthWrapper";
import { ISession, IUser } from "../../../auth-client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname } from "next/navigation"; // Import the hook
import { useEffect, useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import useUserStore from "@/context/useUserStore";
import useCartStore from "@/context/useCartStore";
import useStore from "@/context/useStore";

const Navbar = ({
    session,
    user,
}: {
    session: ISession | null;
    user: IUser | null;
}) => {
    const { setCurrentUser, setSession } = useUserStore();
    const { syncCartWithServer } = useCartStore();
    const { allProducts } = useStore();

    useEffect(() => {
        if (user && session) {
            setCurrentUser(user);
            setSession(session);
        }
        syncCartWithServer(user, allProducts);
    }, [
        user,
        session,
        setCurrentUser,
        setSession,
        allProducts,
        syncCartWithServer,
    ]);

    const [isDialogOpen, setDialogOpen] = useState(false);

    const isMobile = useIsMobile();
    const pathname = usePathname(); // Get the current path

    const hideCartIcon = /\/(cart|checkout)/.test(pathname);

    return (
        <div className="sticky top-0 inset-x-0 z-40">
            <div className="bg-black">
                <header className="relative h-16 mx-auto border-b duration-200 bg-white">
                    <MaxWidthWrapper>
                        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
                            <div className="flex-1 basis-0 h-full flex items-center">
                                <div className="h-full">
                                    <SideMenu
                                        setDialogOpen={setDialogOpen}
                                        user={user}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center h-full">
                                <Link
                                    href="/"
                                    className="text-md font-semibold hover:text-muted-foreground uppercase"
                                    data-testid="nav-store-link"
                                >
                                    The AURA
                                </Link>
                            </div>

                            <div className="flex items-center h-full flex-1 basis-0 justify-end">
                                <div className="hidden small:flex items-center gap-x-6 h-full">
                                    {process.env
                                        .NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                                        <Link
                                            className="hover:text-muted-foreground"
                                            href="/search"
                                            // scroll={false}
                                            data-testid="nav-search-link"
                                        >
                                            Search
                                        </Link>
                                    )}
                                    <Link
                                        className="hover:text-muted-foreground"
                                        href="/account"
                                        data-testid="nav-account-link"
                                    >
                                        Account
                                    </Link>
                                </div>
                                {!user && !isMobile && (
                                    <div>
                                        <p
                                            // variant="ghost"
                                            onClick={() => setDialogOpen(true)}
                                            className="text-sm mr-4 hover:text-muted-foreground cursor-pointer"
                                        >
                                            Sign In
                                        </p>
                                    </div>
                                )}
                                <AuthDialog
                                    isDialogOpen={isDialogOpen}
                                    setDialogOpen={setDialogOpen}
                                />
                                {/* Conditionally render the Cart icon */}
                                {!hideCartIcon && <Cart />}
                            </div>
                        </nav>
                    </MaxWidthWrapper>
                </header>
            </div>
        </div>
    );
};

export default Navbar;
