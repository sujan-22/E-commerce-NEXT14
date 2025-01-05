"use client";

import Cart from "../cart/Cart";
import SideMenu from "./SideMenu";
import Link from "next/link";
import MaxWidthWrapper from "../utility/MaxWidthWrapper";
import { ISession, IUser } from "../../../auth-client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import useUserStore from "@/context/useUserStore";
import useCartStore from "@/context/useCartStore";
import { addItemToCart } from "@/app/(main)/actions/cart-actions/actions";

const Navbar = ({
    session,
    user,
}: {
    session: ISession | null;
    user: IUser | null | undefined;
}) => {
    const { setCurrentUser, setSession } = useUserStore();
    const { syncCartWithServer, guestCart, clearGuestCart } = useCartStore();

    useEffect(() => {
        const syncGuestCartToDb = async () => {
            if (user && guestCart?.length > 0) {
                try {
                    for (const item of guestCart) {
                        await addItemToCart(
                            user.id,
                            item.productId,
                            item.variantId,
                            item.quantity
                        );
                    }
                    clearGuestCart();
                } catch (error) {
                    console.error("Error syncing guest cart to DB:", error);
                }
            }
        };

        if (user && session) {
            setCurrentUser(user);
            setSession(session);
            syncGuestCartToDb();
        }
        syncCartWithServer(user);
    }, [
        user,
        session,
        guestCart,
        setCurrentUser,
        setSession,
        syncCartWithServer,
        clearGuestCart,
    ]);

    const [isDialogOpen, setDialogOpen] = useState(false);

    const isMobile = useIsMobile();
    const pathname = usePathname();

    const hideCartIcon = /\/(cart|checkout)/.test(pathname);
    const renderSignInTag = !user && !isMobile && !pathname.includes("cart");

    return (
        <div className="sticky top-0 inset-x-0 z-40">
            <div
                className={`bg-background/80 dark:bg-dark-background/80 backdrop-blur-md transition-colors duration-200`}
            >
                <header
                    className="relative h-16 mx-auto border-b duration-200"
                    // className={`bg-background/80 dark:bg-dark-background/80 relative h-16 mx-auto border-b  backdrop-blur-md transition-colors duration-200`}
                >
                    <MaxWidthWrapper>
                        <nav className="text-sm flex items-center justify-between w-full h-full">
                            <div className="flex-1 basis-0 h-full flex items-center">
                                <div>
                                    <SideMenu
                                        setDialogOpen={setDialogOpen}
                                        user={user}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center h-full">
                                <Link
                                    href="/"
                                    className="text-lg font-extrabold font-sans tracking-wider hover:text-muted-foreground uppercase transition-all duration-200 ease-in-out"
                                >
                                    <span className="text-primary">
                                        Polaris
                                    </span>
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
                                {renderSignInTag && (
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
