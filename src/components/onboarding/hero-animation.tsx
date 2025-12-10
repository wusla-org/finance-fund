"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroAnimation() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Smooth mouse movement for parallax
    const springConfig = { damping: 25, stiffness: 120 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / 25; // Sensitivity
            const y = (e.clientY - innerHeight / 2) / 25;
            springX.set(x);
            springY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [springX, springY]);

    return (
        <div className="relative w-full h-[60vh] flex items-center justify-center overflow-visible perspective-1000">
            {/* Background Glow */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-radial from-yellow-500/20 to-transparent blur-3xl"
            />

            {/* THE RISING COIN */}
            <motion.div
                initial={{ y: 500, rotateY: 90, opacity: 0 }}
                animate={{ y: 0, rotateY: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 70,
                    duration: 2,
                    delay: 0.2
                }}
                style={{ x: springX, y: springY }}
                className="relative z-10 w-64 h-64 md:w-80 md:h-80"
            >
                {/* Coin Container (3D feel with CSS shadows) */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[0_0_60px_rgba(234,179,8,0.6),inset_0_-10px_20px_rgba(0,0,0,0.3),inset_0_10px_20px_rgba(255,255,255,0.5)] flex items-center justify-center border-4 border-yellow-400/50">
                    <div className="w-[85%] h-[85%] rounded-full border-2 border-dashed border-yellow-200/50 flex items-center justify-center bg-yellow-500/10 backdrop-blur-sm">
                        <span className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 drop-shadow-md">
                            ₹
                        </span>
                    </div>
                </div>

                {/* Sparkling Particles */}
                <Sparkles />
            </motion.div>

            {/* Floating Text Elements */}
            <FloatingElement delay={1.5} x={-150} y={-100} rotate={-10} emoji="🚀" text="Growth" />
            <FloatingElement delay={1.7} x={150} y={-50} rotate={10} emoji="💎" text="Premium" />
            <FloatingElement delay={1.9} x={0} y={160} rotate={0} emoji="✨" text="Future" />
        </div>
    );
}

function FloatingElement({ delay, x, y, rotate, emoji, text }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, x, y, rotate }}
            transition={{
                type: "spring",
                delay: delay,
                duration: 1
            }}
            className="absolute z-20 flex flex-col items-center p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
        >
            <span className="text-4xl filter drop-shadow-lg">{emoji}</span>
            <span className="text-xs font-bold text-white mt-1 uppercase tracking-wider">{text}</span>
        </motion.div>
    );
}

function Sparkles() {
    const sparkles = Array.from({ length: 10 });
    return (
        <div className="absolute inset-0 pointer-events-none">
            {sparkles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeOut"
                    }}
                    className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"
                />
            ))}
        </div>
    );
}
