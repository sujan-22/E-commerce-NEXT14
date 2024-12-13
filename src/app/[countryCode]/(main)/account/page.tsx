import { Separator } from "@/components/ui/separator";
import React from "react";
import { ProfileForm } from "./profile/profile-form";

const page = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Overview</h3>
        <p className="text-sm text-muted-foreground">
          Signed in as: <span className="font-semibold"> jay@mail.com </span>
        </p>
      </div>

      <Separator />
    </div>
  );
};

export default page;
