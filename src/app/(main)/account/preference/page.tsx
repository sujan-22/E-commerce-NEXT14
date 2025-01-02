"use client";

import { Separator } from "@/components/ui/separator";
import { SellerRequestForm } from "./seller-request-form";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSellerRequest } from "./actions";
import Loader from "@/components/utility/Loader";

export default function AccountPreferencePage() {
  const { data: sellerRequest } = useQuery({
    queryKey: ["get-seller-request"],
    queryFn: async () => await getSellerRequest(),
    retry: true,
    retryDelay: 500,
  });

  if (sellerRequest === undefined) {
    return (
      <div>
        <h3 className="text-lg">Seller Request Status</h3>
        <p className="text-sm text-muted-foreground">
          Here is the current status of your seller request.
        </p>

        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader />
            <h3 className="font-semibold text-xl">
              Loading your seller request...
            </h3>
            <p>This won&apos;t take too long!</p>
          </div>
        </div>
      </div>
    );
  }

  if (sellerRequest?.success) {
    return (
      <div className="space-y-6 bg-background rounded-lg">
        <div>
          <h3 className="text-lg">Seller Request Status</h3>
          <p className="text-sm text-muted-foreground">
            Here is the current status of your seller request.
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`text-sm capitalize ${
                sellerRequest.request?.status === "approved"
                  ? "text-green-600"
                  : sellerRequest.request?.status === "denied"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {sellerRequest.request?.status}
            </span>
          </p>
          {sellerRequest.request?.status === "pending" && (
            <p className="text-sm text-muted-foreground">
              We&apos;ve received your request and it is currently under review.
              You will be notified once a decision is made.
            </p>
          )}
          {sellerRequest.request?.status === "denied" &&
            sellerRequest.request.denialReason && (
              <p className="text-sm text-red-600">
                <span className="font-medium">Denied Reason:</span>{" "}
                {sellerRequest.request.denialReason}
              </p>
            )}
          {sellerRequest.request?.status === "approved" && (
            <p className="text-sm text-green-600">
              Congratulations! Your request has been approved. You can now
              upload your own products.
            </p>
          )}
          <p className="text-sm">
            <span className="font-medium">Requested on:</span>{" "}
            <span className="text-muted-foreground">
              {new Date(sellerRequest.request!.createdAt).toLocaleString()}
            </span>
          </p>
          {sellerRequest.request?.status === "approved" &&
            sellerRequest.request.approvedAt && (
              <p className="text-sm">
                <span className="font-medium">Approved At:</span>{" "}
                <span className="text-muted-foreground">
                  {new Date(sellerRequest.request.approvedAt).toLocaleString()}
                </span>
              </p>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Become a Seller</h3>
        <p className="text-sm text-muted-foreground">
          Request to become a seller and start uploading your own products.
        </p>
      </div>
      <Separator />
      <Suspense>
        <SellerRequestForm />
      </Suspense>
    </div>
  );
}
