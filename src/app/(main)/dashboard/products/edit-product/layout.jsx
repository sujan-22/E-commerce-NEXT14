"use client";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";

const Layout = ({ children }) => {
    return (
        <MaxWidthWrapper className="flex-1 flex flex-col">
            {children}
        </MaxWidthWrapper>
    );
};

export default Layout;
