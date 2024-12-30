import { useTheme } from "next-themes";
import React from "react";
import { HashLoader } from "react-spinners";

const Loader = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    return <HashLoader color={isDark ? "white" : "black"} size={30} />;
};

export default Loader;
