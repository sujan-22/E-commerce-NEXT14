"use client";
import { Separator } from "@/components/ui/separator";
import ProfileName from "@/components/account/profile-name";
import ProfileEmail from "@/components/account/profile-email";
import useUserStore from "@/context/useUserStore";
import ProfilePassword from "@/components/account/profile-password";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loader from "@/components/utility/Loader";
import prisma from "@/lib/prisma";

export default function SettingsProfilePage() {
  const { currentUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  console.log("currentUser", currentUser);

  const handleSubmit = async () => {
    try {
      // Delete related posts first
      setLoading(true);
      await prisma.user.delete({
        where: {
          id: currentUser!.id,
        },
      });
      setLoading(false);
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user and dependencies:", error);
      throw new Error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader />
          <h3 className="font-semibold text-xl">Deleteing account...</h3>
          <p>This won&apos;t take too long!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg">Profile</h3>
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
        <Button
          className="w-[20%] text-red-500"
          variant={"outline"}
          onClick={handleSubmit}
        >
          Delete Account
        </Button>
        {/*<Divider />
        <ProfileBillingAddress customer={customer} regions={regions} /> */}
      </div>
    </div>
  );
}
