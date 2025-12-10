"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}

export function CountUp({
    value,
    prefix = "",
    suffix = "",
    duration = 2,
    className = ""
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
        duration: duration * 1000 // spring duration is usually different, but let's try to match feel
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = prefix + new Intl.NumberFormat('en-IN', {
                    maximumFractionDigits: 0
                }).format(latest.toFixed(0)) + suffix;
            }
        });
    }, [springValue, prefix, suffix]);

    return <span ref={ref} className={className} />;
}
