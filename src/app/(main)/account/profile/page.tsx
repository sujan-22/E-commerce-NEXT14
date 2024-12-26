"use client";
import { Separator } from "@/components/ui/separator";
import ProfileName from "@/components/account/profile-name";
import ProfileEmail from "@/components/account/profile-email";
import useUserStore from "@/context/useUserStore";
import ProfilePassword from "@/components/account/profile-password";

export default function SettingsProfilePage() {
    const { currentUser } = useUserStore();
    return (
        <div className="space-y-6 ml-2">
            <div>
                <h3 className="text-md font-semibold">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    Update your profile information to personalize your shopping
                    experience.
                </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-y-8 w-full">
                <ProfileName currentUser={currentUser!} />
                <Separator />
                <ProfileEmail currentUser={currentUser!} />
                <Separator />
                <ProfilePassword />
                <Separator />
                {/*<Divider />
        <ProfileBillingAddress customer={customer} regions={regions} /> */}
            </div>
        </div>
    );
}
