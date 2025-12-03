"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { X, Heart, CreditCard, Sparkles } from "lucide-react";

interface ContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContribute: (amount: number) => void;
}

export function ContributionModal({ isOpen, onClose, onContribute }: ContributionModalProps) {
    const [amount, setAmount] = useState(50);

    const handleContribute = () => {
        onContribute(amount);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md"
                    >
                        <GlassCard className="p-6 border-yellow-500/30 shadow-2xl shadow-yellow-900/20">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500 animate-pulse">
                                    <Heart size={32} fill="currentColor" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Make a Difference</h2>
                                <p className="text-slate-400 text-sm mt-1">Your contribution shapes the future.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-white mb-2">
                                        <span className="text-3xl text-yellow-500 align-top">$</span>
                                        {amount}
                                    </div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Contribution Amount</div>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="1000"
                                        step="10"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                                        <span>$10</span>
                                        <span>$500</span>
                                        <span>$1000</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {[20, 50, 100].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`py-2 rounded-lg text-sm font-medium transition-colors ${amount === val
                                                    ? 'bg-yellow-500 text-black'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleContribute}
                                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-yellow-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    <Sparkles size={20} className="group-hover:animate-spin" />
                                    Confirm Contribution
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
