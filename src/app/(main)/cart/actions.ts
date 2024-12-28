"use server";

import { CartItem } from "@/context/useCartStore";
import { getServerSideSession } from "@/hooks/SessionHandler";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Order } from "@prisma/client";

export const createCheckoutSession = async ({
    cartTotal,
    cart,
    images,
}: {
    cartTotal: number;
    cart: CartItem[];
    images: string[];
}) => {
    const { user } = await getServerSideSession();

    if (!user) {
        throw new Error("No user found");
    }

    const lastOrder = await prisma.order.findFirst({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            orderNumber: true,
        },
    });

    let orderNumber = "23468";

    if (lastOrder) {
        orderNumber = (parseInt(lastOrder.orderNumber) + 1).toString();
    }

    const tax = +(cartTotal * 0.13).toFixed(2);
    const shipping = 3.0;
    const amount = +(cartTotal + tax + shipping).toFixed(2);

    let order: Order | undefined = undefined;

    order = await prisma.order.create({
        data: {
            cartAmount: cartTotal,
            orderNumber: orderNumber,
            amount: amount,
            userId: user.id,
            cart: {
                set: cart.map((item) => ({
                    productId: item.productId,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize,
                    quantity: item.quantity || 1,
                })),
            },
        },
    });

    const product = await stripe.products.create({
        name: "Polaris",
        images: images,
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
