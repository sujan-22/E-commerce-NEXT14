"use client";

import Cart from "./cart/Cart";
import SideMenu from "./SideMenu";
import LocalizedClientLink from "@/lib/LocalizedClientLink";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Dialogbox from "./Dialogbox";
import useStore from "@/context/useStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname } from "next/navigation"; // Import the hook
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const userData = useStore((state) => state.userData);
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
                    isDialogOpen={isDialogOpen}
                    setDialogOpen={setDialogOpen}
                  />
                </div>
              </div>

              <div className="flex items-center h-full">
                <LocalizedClientLink
                  href="/"
                  className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
                  data-testid="nav-store-link"
                >
                  The AURA
                </LocalizedClientLink>
              </div>

              <div className="flex items-center h-full flex-1 basis-0 justify-end">
                <div className="hidden small:flex items-center gap-x-6 h-full">
                  {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
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

                {/* Conditionally render the Cart icon */}
                {!hideCartIcon && <Cart />}

                {!userData && !isMobile && (
                  <div className="ml-5">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(true)}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
                <Dialogbox
                  isDialogOpen={isDialogOpen}
                  setDialogOpen={setDialogOpen}
                />
              </div>
            </nav>
          </MaxWidthWrapper>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
