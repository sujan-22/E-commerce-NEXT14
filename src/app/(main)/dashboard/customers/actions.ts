"use server";

import db from "@/lib/prisma";

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany();
        return {
            success: true,
            users: users,
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
