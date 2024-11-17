"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";

const Page = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/"); // Redirects to the home page
    };

    return (
        <MaxWidthWrapper>
            <div className="flex justify-center items-center min-h-screen">
                <main className="flex flex-col gap-8 items-center text-center">
                    <span className="text-sm">
                        <p className="mb-2 text-lg font-semibold">
                            Unauthorized Access
                        </p>
                        <p className="mb-4 text-md text-muted-foreground">
                            You don&apos;t have permission to access this page.
                        </p>
                    </span>

                    <Button onClick={handleGoHome}>Go back to home page</Button>
                </main>
            </div>
        </MaxWidthWrapper>
    );
};

export default Page;
