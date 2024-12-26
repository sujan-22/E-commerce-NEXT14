import { CartItem } from "@/context/useCartStore";
import { Product } from "@/context/useStore";

export const calculateCartTotal = (
    cartItems: CartItem[],
    allProducts: Product[]
) => {
    return cartItems.reduce((total, item) => {
        const product = allProducts.find(
            (product) => product.id === item.productId
        );

        if (product) {
            let itemPrice = product.price;

            if (product.collection?.onsale?.newPrice) {
                itemPrice = product.collection.onsale.newPrice;
            }

            return total + item.quantity! * itemPrice;
        }

        return total;
    }, 0);
};
