"use server";

import db from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const getAllOrders = async () => {
    try {
        const orders = await db.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true },
                },
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

        const flattenedRequests = orders.map((order) => ({
            ...order,
            name: order.user.name,
            email: order.user.email,
        }));

        return {
            success: true,
            message: "Orders retrieved successfully.",
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

export const updateOrderStatus = async ({
    orderId,
    newStatus,
}: {
    orderId: string;
    newStatus: OrderStatus;
}) => {
    try {
        const updatedOrderStatus = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: newStatus,
                // ...(newStatus === OrderStatus.fulfilled && {
                //   fulfilledAt: new Date(),
                // }),
                // ...(newStatus === OrderStatus.shipped && {
                //   shippedAt: new Date(),
                // }),
            },
        });

        // if (newStatus ===  OrderStatus.fulfilled && order.user) {
        //   await db.user.update({
        //     where: { id: sellerRequest.user.id },
        //     data: {
        //       role: "seller",
        //     },
        //   });
        // }

        // if (newStatus === RequestStatus.pending && sellerRequest.user) {
        //   await db.user.update({
        //     where: { id: sellerRequest.user.id },
        //     data: {
        //       role: "user",
        //     },
        //   });
        // }

        return {
            success: true,
            message: `Order status updated to ${newStatus}.`,
            request: updatedOrderStatus,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while updating the order status.",
        };
    }
};
