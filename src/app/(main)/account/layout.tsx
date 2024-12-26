"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const sidebarNavItems = [
    {
        title: "Overview",
        href: "/account",
    },
    {
        title: "Profile",
        href: "/account/profile",
    },
    {
        title: "Appearance",
        href: "/account/appearance",
    },
    {
        title: "Notifications",
        href: "/account/notifications",
    },
    {
        title: "Orders",
        href: "/account/orders",
    },
];

interface SettingsLayoutClientProps {
    children: React.ReactNode;
}

export default function SettingsLayoutClient({
    children,
}: SettingsLayoutClientProps) {
    const router = useRouter();

    return (
        <>
            <div className="space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Settings
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0">
                    {/* Sidebar for larger screens */}
                    <aside className="hidden space-y-8 lg:block lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>

                    {/* Dropdown for smaller screens */}
                    <div className="block lg:hidden mb-6">
                        <Select
                            onValueChange={(value) => router.push(value)}
                            defaultValue={sidebarNavItems[0].href}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a page" />
                            </SelectTrigger>
                            <SelectContent>
                                {sidebarNavItems.map((item) => (
                                    <SelectItem
                                        key={item.href}
                                        value={item.href}
                                    >
                                        {item.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 lg:max-w-full">{children}</div>
                </div>
            </div>
        </>
    );
}
