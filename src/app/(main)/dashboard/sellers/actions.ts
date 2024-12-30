"use server";

import db from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";

export const getAllSellerRequests = async () => {
    try {
        const sellerRequests = await db.sellerRequest.findMany({
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!sellerRequests.length) {
            return {
                success: false,
                message: "No seller requests found.",
            };
        }

        const flattenedRequests = sellerRequests.map((request) => ({
            ...request,
            name: request.user.name,
            email: request.user.email,
        }));

        return {
            success: true,
            message: "Seller requests retrieved successfully.",
            requests: flattenedRequests,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.",
        };
    }
};

export const updateSellerRequestStatus = async ({
    sellerRequestId,
    newStatus,
}: {
    sellerRequestId: string;
    newStatus: RequestStatus;
}) => {
    try {
        const sellerRequest = await db.sellerRequest.findUnique({
            where: { id: sellerRequestId },
            include: { user: true },
        });

        if (!sellerRequest) {
            return {
                success: false,
                message: "Seller request not found.",
            };
        }

        const updatedSellerRequest = await db.sellerRequest.update({
            where: { id: sellerRequestId },
            data: {
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === RequestStatus.approved && {
                    approvedAt: new Date(),
                }),
                ...(newStatus === RequestStatus.denied && {
                    denialReason: "Reason for rejection",
                }),
            },
        });

        if (newStatus === RequestStatus.approved && sellerRequest.user) {
            await db.user.update({
                where: { id: sellerRequest.user.id },
                data: {
                    role: "seller",
                },
            });
        }

        if (newStatus === RequestStatus.pending && sellerRequest.user) {
            await db.user.update({
                where: { id: sellerRequest.user.id },
                data: {
                    role: "user",
                },
            });
        }

        return {
            success: true,
            message: `Seller request status updated to ${newStatus}.`,
            request: updatedSellerRequest,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while updating the seller request status.",
        };
    }
};
