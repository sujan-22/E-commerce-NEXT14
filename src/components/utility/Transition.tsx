"use client";
import { motion } from "framer-motion";
const Transition = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
        >
            {children}
        </motion.div>
    );
};

export default Transition;
