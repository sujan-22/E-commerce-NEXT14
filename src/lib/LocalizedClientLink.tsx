"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const LocalizedClientLink = ({
    children,
    href,
    className,
    ...props
}: {
    children?: React.ReactNode;
    href: string;
    className?: string;
    onClick?: () => void;
    passHref?: true;
}) => {
    const { countryCode } = useParams();

    return (
        <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
        >
            <Link
                href={`/${countryCode}${href}`}
                className={className}
                {...props}
            >
                {children}
            </Link>
        </motion.div>
    );
};

export default LocalizedClientLink;
