import { Suspense } from "react";
import Order from "../order-confirmation/Order";

export const metadata = {
    title: "Polaris | Order Confirmation",
};

const Page = () => {
    return (
        <Suspense>
            <Order isOrderDetailsPage />
        </Suspense>
    );
};

export default Page;
