"use client";
import Steps from "@/components/utility/Steps";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";

const Layout = ({ children }) => {
    return (
        <MaxWidthWrapper className="flex-1 flex flex-col">
            <Steps />
            {children}
        </MaxWidthWrapper>
    );
};

export default Layout;
