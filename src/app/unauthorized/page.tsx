"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import { Button } from "@/components/ui/button";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-center my-[35%] lg:my-[10%]">
        <main className="flex flex-col items-center text-center p-8 rounded-lg">
          <div>
            <div className="w-16 h-16 mx-auto text-red-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-red-500">
            Access Denied
          </h1>
          <p className="mb-6">
            You do not have permission to access this page.
          </p>
          <Button
            variant={"secondary"}
            onClick={handleGoHome}
            className="px-6 py-2 rounded-md"
          >
            Go to Homepage
          </Button>
        </main>
      </div>
    </MaxWidthWrapper>
  );
};

export default UnauthorizedPage;
