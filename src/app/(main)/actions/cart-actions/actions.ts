"use server";

import prisma from "@/lib/prisma";

export const addItemToCart = async (
  userId: string,
  productId: string,
  variantId: string,
  quantity: number
) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          total: 34.3,
          items: {
            create: [
              {
                productId,
                variantId,
                quantity,
              },
            ],
          },
        },
        include: { items: true },
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (existingItem) {
        cart = await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              update: {
                where: { id: existingItem.id },
                data: {
                  quantity: existingItem.quantity + quantity,
                },
              },
            },
          },
          include: { items: true },
        });
      } else {
        cart = await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              create: [
                {
                  productId,
                  variantId,
                  quantity,
                },
              ],
            },
          },
          include: { items: true },
        });
      }
    }

    return cart;
  } catch (error) {
    throw new Error("Error adding item to cart: " + error);
  }
};

export const updateQuantityInCart = async (
  userId: string,
  productId: string,
  variantId: string,
  operation: "increment" | "decrement"
) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Cart not found for the user.");
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (!existingItem) {
      throw new Error("Item not found in cart.");
    }

    let newQuantity = existingItem.quantity;
    if (
      operation === "increment" &&
      newQuantity + 1 <= existingItem.variant.stock
    ) {
      newQuantity += 1;
    } else if (operation === "decrement" && existingItem.quantity > 1) {
      newQuantity -= 1;
    } else if (operation === "decrement" && existingItem.quantity <= 1) {
      throw new Error("Quantity cannot be less than 1.");
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          update: {
            where: { id: existingItem.id },
            data: {
              quantity: newQuantity,
            },
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw new Error("Error updating quantity: " + error);
  }
};

export const removeItemFromCart = async (
  userId: string,
  productId: string,
  variantId: string
) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error("Cart not found for the user.");
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (!existingItem) {
      throw new Error("Item not found in cart.");
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          delete: {
            id: existingItem.id,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing item:", error);
    throw new Error("Error removing item: " + error);
  }
};

export const getCartItemsForUser = async (userId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Cart not found for the user.");
    }

    let cartTotal = 0;
    let cartItemsCount = 0;

    const items = cart.items.map((item) => {
      const productPrice =
        item.product.price !== null &&
        item.product.price !== item.product.basePrice
          ? item.product.price
          : item.product.basePrice;

      const itemTotal = productPrice * item.quantity;

      cartTotal += itemTotal;
      cartItemsCount += item.quantity;

      return {
        id: item.id,
        quantity: item.quantity,
        color: item.variant.color,
        size: item.variant.size,
        product: item.product,
        variantId: item.variantId,
      };
    });

    return {
      id: cart.id,
      items,
      cartTotal,
      cartItemsCount,
    };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Could not fetch cart items.");
  }
};
