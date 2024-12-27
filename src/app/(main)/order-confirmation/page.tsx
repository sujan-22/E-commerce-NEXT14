import { Suspense } from "react";
import ThankYou from "./ThankYou";

export const metadata = {
    title: "Polaris | Order Confirmation",
};

const Page = () => {
    return (
        <Suspense>
            <ThankYou />
        </Suspense>
    );
};

export default Page;
