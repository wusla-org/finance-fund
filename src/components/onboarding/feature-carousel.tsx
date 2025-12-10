"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "Smart Tracking",
        description: "Monitor every rupee with real-time analytics.",
        color: "bg-blue-500",
        delay: 2.2
    },
    {
        title: "Transparent",
        description: "Open ledger for complete accountability.",
        color: "bg-emerald-500",
        delay: 2.4
    },
    {
        title: "Instant Updates",
        description: "See contributions as they happen.",
        color: "bg-purple-500",
        delay: 2.6
    }
];

export function FeatureCarousel() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: feature.delay, duration: 0.5 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="relative overflow-hidden group p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${feature.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                            {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm relative z-10">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="text-center mt-12"
            >
                <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    Get Started
                </button>
            </motion.div>
        </div>
    );
}
