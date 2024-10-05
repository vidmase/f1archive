import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Cover = ({ children, className, childClassName, coverClassName }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        containerRef.current.style.setProperty("--mouse-x", `${x}`);
        containerRef.current.style.setProperty("--mouse-y", `${y}`);
    };

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
                "relative overflow-hidden",
                className
            )}
        >
            <div className={cn("relative z-10", childClassName)}>{children}</div>
            <motion.div
                className={cn(
                    "absolute inset-0 z-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
                    coverClassName
                )}
                initial={false}
                animate={{
                    scale: isHovered || isFocused ? 1.5 : 1,
                    opacity: isHovered || isFocused ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{
                    backgroundPosition: "var(--mouse-x, 0.5) var(--mouse-y, 0.5)",
                    backgroundSize: "150% 150%",
                }}
            />
        </motion.div>
    );
};

export default Cover;
