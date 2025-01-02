import { IGuestCart } from "@/context/useCartStore";

export const calculateCartTotal = (guestCart: IGuestCart[]): number => {
    return guestCart.reduce((total, item) => {
        const productPrice =
            item.product?.basePrice === item.product.price
                ? item.product.basePrice
                : item.product.price;
        return total + productPrice! * item.quantity;
    }, 0);
};
