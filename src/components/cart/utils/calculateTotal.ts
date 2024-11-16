import { CartItem } from "@/context/useStore";

export const calculateCartTotal = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    const itemPrice = item.price;
    return total + item.quantity * itemPrice;
  }, 0);
};
