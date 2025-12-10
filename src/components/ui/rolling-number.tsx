"use client";

import { motion } from "framer-motion";

const fontSize = 48; // Adjust based on your design
const padding = 15;
const height = fontSize + padding;

function NumberColumn({ digit, delay }: { digit: string, delay: number }) {
    const isNumber = !isNaN(parseInt(digit));

    if (!isNumber) {
        return <div style={{ height }} className="flex items-center justify-center">{digit}</div>;
    }

    const number = parseInt(digit);

    // Create a strip of numbers: [0-9, 0-9, 0-9] to allow for spinning
    // We want to land on the number in the 3rd set to ensure we spin through
    const decimals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const strip = [...decimals, ...decimals, ...decimals];

    // Target index is in the 3rd set (index 20 + number)
    // e.g. if target is 5, we go to index 25.
    // We start at y=0 (index 0 which is 0).
    const targetIndex = 20 + number;

    return (
        <div style={{ height, overflow: "hidden" }} className="relative">
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: -1 * targetIndex * height }}
                transition={{
                    duration: 2,
                    ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth "spin and stop"
                    delay: delay
                }}
                className="flex flex-col items-center"
            >
                {strip.map((num, i) => (
                    <div key={i} style={{ height }} className="flex items-center justify-center font-bold">
                        {num}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

interface RollingNumberProps {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function RollingNumber({ value, prefix = "", suffix = "", className = "" }: RollingNumberProps) {
    const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(value);

    // Split into characters
    // Reverse to calculate delay from right to left if desired, but left-to-right is fine too
    const characters = formatted.split("");

    return (
        <div className={`flex flex-row overflow-hidden ${className}`} style={{ height }}>
            {prefix && <div className="flex items-center justify-center mr-1">{prefix}</div>}
            {characters.map((char, index) => (
                <NumberColumn
                    key={`${index}-${char}`}
                    digit={char}
                    delay={index * 0.1} // Stagger the start of each column
                />
            ))}
            {suffix && <div className="flex items-center justify-center ml-1">{suffix}</div>}
        </div>
    );
}
