"use server";

import db from "@/lib/prisma";

export const getAllOrdersByUserId = async (userId: string) => {
    try {
        const orders = await db.order.findMany({
            where: { userId },
            include: {
                OrderItem: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!orders.length) {
            return {
                success: false,
                message: "No orders found.",
            };
        }

        return {
            success: true,
            message: "Orders retrieved successfully.",
            orders,
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
