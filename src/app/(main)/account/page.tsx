"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import useUserStore from "@/context/useUserStore";

const Page = () => {
    const { currentUser } = useUserStore();
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-md">Overview</h3>
                <p className="text-sm text-muted-foreground">
                    Signed in as:{" "}
                    <span className="font-semibold">{currentUser?.email}</span>
                </p>
            </div>

            <Separator />
        </div>
    );
};

export default Page;
