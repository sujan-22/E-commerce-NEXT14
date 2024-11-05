"use client";
import Steps from "@/components/Steps";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Layout = ({ children }) => {
    return (
        <MaxWidthWrapper className="flex-1 flex flex-col">
            <Steps />
            {children}
        </MaxWidthWrapper>
    );
};

export default Layout;
