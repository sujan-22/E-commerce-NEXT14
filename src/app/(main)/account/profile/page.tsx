"use client";
import { Separator } from "@/components/ui/separator";
import ProfileName from "@/components/account/profile-name";
import ProfileEmail from "@/components/account/profile-email";
import useUserStore from "@/context/useUserStore";
import ProfilePassword from "@/components/account/profile-password";

export default function SettingsProfilePage() {
  const { currentUser } = useUserStore();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
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
