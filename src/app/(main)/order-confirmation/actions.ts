"use server";

import { getServerSideSession } from "@/hooks/SessionHandler";
import db from "@/lib/prisma";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
    const { user } = await getServerSideSession();

    if (!user?.id || !user.email) {
        throw new Error("Invalid user data");
    }

    const order = await db.order.findFirst({
        where: {
            id: orderId,
            userId: user.id,
        },
        include: {
            billingAddress: true,
            shippingAddress: true,
            user: true,
            OrderItem: {
                include: {
                    product: true,
                    variant: true,
                },
            },
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.isPaid) {
        return order;
    } else {
        return false;
    }
};
