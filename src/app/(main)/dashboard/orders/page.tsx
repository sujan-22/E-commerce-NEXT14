"use client";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
const Page = () => {
  const router = useRouter();
  return (
    <MaxWidthWrapper>
      <Button
        className="flex items-center mt-4 space-x-2 cursor-pointer"
        onClick={() => router.back()}
        variant={"ghost"}
      >
        <ArrowLeft /> <span>Go back</span>
      </Button>
    </MaxWidthWrapper>
  );
};

export default Page;
