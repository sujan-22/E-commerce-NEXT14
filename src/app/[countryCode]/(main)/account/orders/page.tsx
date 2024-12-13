import { Separator } from "@/components/ui/separator";
import React from "react";

const page = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Orders</h3>
        <p className="text-sm text-muted-foreground"></p>
      </div>

      <Separator />
      <div className="flex justify-center">
        <p>Orders will be displayed here.</p>
      </div>
    </div>
  );
};

export default page;
