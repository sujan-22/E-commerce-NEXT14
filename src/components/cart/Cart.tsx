import { ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "../ui/sheet";
import { buttonVariants } from "../ui/button";
import CartLine from "./CartLine";
import Link from "next/link";
import { useFormatPrice } from "@/lib/utils";
import useCartStore from "@/context/useCartStore";

const Cart: React.FC = () => {
  const { cartTotal, cartItemsCount, cart, guestCart } = useCartStore();
  const { formatPrice } = useFormatPrice();
  return (
    <Sheet>
      <SheetTrigger className="group flex items-center hover:text-muted-foreground ">
        <p className="text-sm">Cart</p>
        <span className=" ml-1 text-sm font-medium">({cartItemsCount})</span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-[1000000] h-full">
        <div className="flex-grow flex flex-col pr-6 overflow-y-auto">
          {cartItemsCount > 0 ? (
            <>
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul className="flex-grow overflow-auto py-4">
                  {(cart?.length || guestCart?.length) > 0 ? (
                    <>
                      {cart &&
                        cart.map((item, i) =>
                          item ? (
                            <CartLine
                              product={item.product}
                              quantity={item.quantity}
                              size={item.size}
                              color={item.color}
                              variantId={item.variantId}
                              key={`cart-${i}`}
                            />
                          ) : null
                        )}
                      {guestCart &&
                        guestCart.map((item, i) =>
                          item ? (
                            <CartLine
                              product={item.product}
                              quantity={item.quantity}
                              size={item.size}
                              color={item.color}
                              variantId={item.variantId}
                              key={`guestCart-${i}`}
                            />
                          ) : null
                        )}
                    </>
                  ) : null}

                  {/* {cart?.map((item, i) => {
                                        return item ? (
                                            <CartLine
                                                product={item.product}
                                                quantity={item.quantity}
                                                size={item.size}
                                                color={item.color}
                                                variantId={item.variantId}
                                                key={i}
                                            />
                                        ) : null;
                                    })} */}
                </ul>
                <div className="py-4 text-sm text-primary">
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                    <p>Total</p>
                    <p className="flex justify-end space-y-2 text-right text-sm">
                      {formatPrice(cartTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-1">
              <div
                aria-hidden="true"
                className="relative mb-4 h-60 w-60 text-primary"
              >
                <ShoppingBag className="relative mb-4 h-60 w-60" />
              </div>
              <div className="text-xl font-semibold">Your cart is empty</div>
              <SheetTrigger asChild>
                <Link
                  href="/products/category/all"
                  className={buttonVariants({
                    variant: "link",
                    size: "default",
                    className: "text-sm text-secondary-foreground",
                  })}
                >
                  Add items to your cart to checkout
                </Link>
              </SheetTrigger>
            </div>
          )}
        </div>
        {cartItemsCount > 0 && (
          <div className="pr-6">
            <SheetFooter>
              <div className="w-full">
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      variant: "default",
                      size: "default",
                      className: "w-full",
                    })}
                  >
                    View Cart ({cartItemsCount})
                  </Link>
                </SheetTrigger>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
