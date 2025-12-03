"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" } : {}}
            className={cn(
                "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl",
                "hover:bg-white/10 transition-colors duration-300",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
