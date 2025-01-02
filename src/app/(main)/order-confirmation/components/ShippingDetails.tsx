import { Separator } from "@/components/ui/separator";
import { BillingAddress, Order, ShippingAddress, User } from "@prisma/client";

interface OrderWithRelations extends Order {
  shippingAddress?: ShippingAddress | null;
  billingAddress?: BillingAddress | null;
  user?: User | null;
}

const ShippingDetails = ({ order }: { order: OrderWithRelations }) => {
  return (
    <div>
      <h2 className="flex flex-row text-xl my-4 lg:my-6">Delivery</h2>
      <div className="flex flex-col md:flex-row items-start gap-y-8 md:gap-y-0 md:gap-x-8">
        {/* Shipping Address Block */}
        <div
          className="flex flex-col w-full md:w-1/3"
          data-testid="shipping-address-summary"
        >
          <p className="text-sm mb-1">Shipping Address</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress?.street} {order.shippingAddress?.postalCode}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress?.city}, {order.shippingAddress?.state}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress?.country}
          </p>
        </div>

        {/* Billing Address Block */}
        <div
          className="flex flex-col w-full md:w-1/3"
          data-testid="billing-address-summary"
        >
          <p className="text-sm mb-1">Billing Address</p>
          <p className="text-sm text-muted-foreground">
            {order.billingAddress?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.billingAddress?.street} {order.billingAddress?.postalCode}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.billingAddress?.city}, {order.billingAddress?.state}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.billingAddress?.country}
          </p>
        </div>

        {/* Contact Block */}
        <div
          className="flex flex-col w-full md:w-1/3"
          data-testid="shipping-method-summary"
        >
          <p className="text-sm mb-1">Contact</p>
          <p className="text-sm text-muted-foreground">{order.user?.name}</p>
          <p className="text-sm text-muted-foreground">{order.user?.email}</p>
        </div>
      </div>
      <Separator className="mt-8" />
    </div>
  );
};

export default ShippingDetails;
