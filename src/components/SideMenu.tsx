// "use client";

import LocalizedClientLink from "@/lib/LocalizedClientLink";
import { Popover, Transition } from "@headlessui/react";
import { ArrowRight, X } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import CountrySelect from "./CountrySelect";
import { cn } from "@/lib/utils";
import { handleSignOut } from "@/app/actions/authActions";
import useStore, { IUser } from "@/context/useStore";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SideMenuProps {
    isDialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>; // Type for a function that sets state
}

const SideMenu = ({ isDialogOpen, setDialogOpen }: SideMenuProps) => {
    const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
    const logoutUser = useStore((state) => state.logoutUser); // Access logoutUser function from Zustand store
    const isMobile = useIsMobile();
    const userData = useStore((state) => state.userData);

    const getGreeting = (userData?: IUser) => {
        const currentHour = new Date().getHours();
        const userName = userData?.name || "";

        let greeting = "";

        if (currentHour >= 5 && currentHour < 12) {
            greeting = "Good Morning";
        } else if (currentHour >= 12 && currentHour < 17) {
            greeting = "Good Afternoon";
        } else if (currentHour >= 17 || currentHour < 5) {
            // Include early morning hours
            greeting = "Good Evening";
        }

        return userName ? `${greeting}, ${userName}!` : `${greeting}!`;
    };

    const handleLogout = () => {
        logoutUser(); // Clear the state from Zustand
        handleSignOut(); // Call the signOut method from NextAuth
    };

    const toggleState = {
        state: isCountrySelectOpen,
        open: () => setIsCountrySelectOpen(true),
        close: () => setIsCountrySelectOpen(false),
    };

    const SideMenuItems = {
        Home: "/",
        Store: "/store",
        Search: "/search",
        Account: "/account",
        Cart: "/cart",
        ...(!userData ? {} : { "Sign out": () => handleLogout() }),
        ...(isMobile && !userData
            ? { "Sign In": () => setDialogOpen(true) }
            : {}),
    };

    return (
        <div className="h-full">
            <div className="flex items-center h-full">
                <Popover className="h-full flex">
                    {({ open, close }) => (
                        <>
                            <div className="relative flex h-full">
                                <Popover.Button
                                    data-testid="nav-menu-button"
                                    className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                                >
                                    Menu
                                </Popover.Button>
                            </div>

                            <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-150"
                                enterFrom="opacity-0"
                                enterTo="opacity-100 backdrop-blur-2xl"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 backdrop-blur-2xl"
                                leaveTo="opacity-0"
                            >
                                <Popover.Panel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm text-secondary m-2 backdrop-blur-2xl">
                                    <div
                                        data-testid="nav-menu-popup"
                                        className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-md justify-between p-6"
                                    >
                                        <div
                                            className="flex justify-end"
                                            id="xmark"
                                        >
                                            <button
                                                data-testid="close-menu-button"
                                                onClick={close}
                                            >
                                                <X />
                                            </button>
                                        </div>
                                        <h2 className="text-3xl">
                                            {getGreeting(userData)}
                                        </h2>
                                        <ul className="flex flex-col gap-6 items-start justify-start">
                                            {Object.entries(SideMenuItems).map(
                                                ([name, actionOrHref]) => {
                                                    const isFunction =
                                                        typeof actionOrHref ===
                                                        "function";

                                                    return (
                                                        <li key={name}>
                                                            {isFunction ? (
                                                                <button
                                                                    className="text-2xl leading-10 hover:text-muted-foreground"
                                                                    onClick={() => {
                                                                        actionOrHref(); // Call the function
                                                                        close(); // Close the menu
                                                                    }}
                                                                    data-testid={`${name.toLowerCase()}-button`}
                                                                >
                                                                    {name}
                                                                </button>
                                                            ) : (
                                                                <LocalizedClientLink
                                                                    href={
                                                                        actionOrHref as string
                                                                    }
                                                                    className="text-2xl leading-10 hover:text-muted-foreground"
                                                                    onClick={
                                                                        close
                                                                    }
                                                                    data-testid={`${name.toLowerCase()}-link`}
                                                                >
                                                                    {name}
                                                                </LocalizedClientLink>
                                                            )}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>

                                        <div className="flex flex-col gap-y-6">
                                            <div
                                                className="flex justify-between"
                                                onClick={() =>
                                                    toggleState.state
                                                        ? toggleState.close()
                                                        : toggleState.open()
                                                }
                                            >
                                                <CountrySelect
                                                    toggleState={toggleState}
                                                />
                                                <ArrowRight
                                                    className={cn(
                                                        "transition-transform duration-150",
                                                        toggleState.state
                                                            ? "-rotate-90"
                                                            : ""
                                                    )}
                                                />
                                            </div>
                                            <p className="flex justify-between txt-compact-small">
                                                © {new Date().getFullYear()}{" "}
                                                AURA, Inc. All rights reserved.
                                            </p>
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
        </div>
    );
};

export default SideMenu;
