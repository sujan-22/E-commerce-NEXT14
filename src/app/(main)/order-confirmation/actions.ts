"use server";

import { getServerSideSession } from "@/hooks/SessionHandler";
import { CartAPI } from "@/lib/cart-utils/CartAPI";
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
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    await CartAPI("clear", user.id);

    if (order.isPaid) {
        return order;
    } else {
        return false;
    }
};
