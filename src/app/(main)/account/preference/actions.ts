"use server";

import { getServerSideSession } from "@/hooks/SessionHandler";
import db from "@/lib/prisma";
import { IData } from "./seller-request-form";

export const requestSellerAccess = async (): Promise<IData> => {
    const { user } = await getServerSideSession();

    if (!user?.id || !user.email) {
        throw new Error("Invalid user data");
    }

    try {
        // Check if there's already an existing request
        const existingRequest = await db.sellerRequest.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (existingRequest) {
            throw new Error("A seller request already exists for this user.");
        }

        const newRequest = await db.sellerRequest.create({
            data: {
                userId: user.id,
                status: "pending",
            },
        });

        return {
            success: true,
            message: "Seller request submitted successfully.",
            request: newRequest,
        };
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export const getSellerRequest = async (): Promise<IData> => {
    const { user } = await getServerSideSession();

    if (!user?.id || !user.email) {
        throw new Error("Invalid user data");
    }

    try {
        const sellerRequest = await db.sellerRequest.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!sellerRequest) {
            return {
                success: false,
                message: "No seller request found for the current user.",
            };
        }

        return {
            success: true,
            message: "Seller request retrieved successfully.",
            request: sellerRequest,
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
