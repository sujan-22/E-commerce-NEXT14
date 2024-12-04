import LocalizedClientLink from "@/lib/LocalizedClientLink";
import { ChevronDown } from "lucide-react";

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full bg-white relative small:min-h-screen">
            <div className="relative" data-testid="checkout-container">
                {children}
            </div>
        </div>
    );
}
