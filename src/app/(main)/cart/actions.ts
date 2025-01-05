"use server";

import { nanoid } from "nanoid";
import { getServerSideSession } from "@/hooks/SessionHandler";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const generateOrderNumber = (): string => {
    return nanoid(5);
};

export const createCheckoutSession = async ({
    cartTotal,
    cartId,
    images,
}: {
    cartTotal: number;
    cartId: string;
    images: string;
}) => {
    const { user } = await getServerSideSession();

    if (!user) {
        throw new Error("No user found");
    }

    const tax = +(cartTotal * 0.13).toFixed(2);
    const shipping = 3.0;
    const amount = +(cartTotal + tax + shipping).toFixed(2);

    const order = await prisma.order.create({
        data: {
            orderNumber: generateOrderNumber(),
            amount: amount,
            userId: user.id,
            cartAmount: cartTotal,
        },
    });

    const cartItems = await prisma.cartItem.findMany({
        where: { cartId },
    });

    await prisma.orderItem.createMany({
        data: cartItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            variantId: item.variantId,
        })),
    });

    await prisma.cartItem.deleteMany({
        where: { cartId },
    });

    const product = await stripe.products.create({
        name: "Polaris",
        images: [images],
        default_price_data: {
            currency: "cad",
            unit_amount: Math.round(amount * 100),
        },
    });

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        payment_method_types: ["card"],
        mode: "payment",
        shipping_address_collection: { allowed_countries: ["CA"] },
        metadata: {
            userId: user.id,
            orderId: order.id,
        },
        line_items: [{ price: product.default_price as string, quantity: 1 }],
    });

    return { url: stripeSession.url };
};
