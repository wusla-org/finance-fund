"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Trophy, Users, TrendingUp, Heart, Sparkles, ArrowUpRight } from "lucide-react";
import { UserProfile } from "@/components/user-profile";
import { DepartmentLeaderboard } from "@/components/department-leaderboard";

// Mock Data
const GOAL = 50000; // $50,000 Goal
const INITIAL_COLLECTED = 32450; // Starting amount

const RECENT_DONORS = [
    { name: "Alice Johnson", amount: 500, time: "2 mins ago" },
    { name: "Tech Corp Inc.", amount: 2000, time: "15 mins ago" },
    { name: "Bob Smith", amount: 100, time: "1 hour ago" },
    { name: "Community Foundation", amount: 5000, time: "3 hours ago" },
    { name: "Sarah Lee", amount: 250, time: "5 hours ago" },
];

export function SponsorshipTracker() {
    const [collected, setCollected] = useState(0);

    // Animation for the number
    const springValue = useSpring(0, { bounce: 0, duration: 2500 });
    const displayValue = useTransform(springValue, (value) => Math.floor(value).toLocaleString());

    useEffect(() => {
        springValue.set(INITIAL_COLLECTED);
        setCollected(INITIAL_COLLECTED);
    }, [springValue]);

    const percentage = Math.min((collected / GOAL) * 100, 100);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 p-4 md:p-8">
            {/* Hero Section */}
            <div className="relative text-center space-y-6 py-12">
                <div className="absolute inset-0 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-6 animate-[pulse-glow_3s_infinite]">
                        <Sparkles size={16} />
                        <span>Official Fundraiser 2025</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            Empower the
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 text-glow">
                            Future
                        </span>
                    </h1>

                    <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Join us in building a legacy. Every contribution brings us closer to our goal of transforming student lives.
                    </p>
                </motion.div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Main Stats (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Total Raised Card */}
                    <GlassCard className="relative overflow-hidden min-h-[400px] flex flex-col justify-center items-center p-8 md:p-12 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-colors duration-500" />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center z-10 relative"
                        >
                            <div className="text-slate-400 font-medium mb-4 uppercase tracking-widest text-sm">Total Raised So Far</div>
                            <div className="text-7xl md:text-9xl font-black text-white flex items-baseline justify-center gap-2 tracking-tighter">
                                <span className="text-5xl md:text-7xl text-yellow-500/80">$</span>
                                <motion.span className="text-glow">{displayValue}</motion.span>
                            </div>
                            <div className="flex items-center justify-center gap-3 mt-6 text-lg text-slate-400">
                                <span>Target Goal:</span>
                                <span className="text-white font-bold bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">
                                    ${GOAL.toLocaleString()}
                                </span>
                            </div>
                        </motion.div>

                        {/* Enhanced Progress Bar */}
                        <div className="w-full max-w-2xl mt-12 relative">
                            <div className="h-6 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800 backdrop-blur-sm">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 2, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 relative"
                                >
                                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                </motion.div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-mono text-slate-500">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Secondary Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard hoverEffect className="flex flex-col justify-between h-full min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                                    <Users size={24} />
                                </div>
                                <div className="text-xs text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                                    <TrendingUp size={12} /> +12%
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">1,240</div>
                                <div className="text-sm text-slate-400 mt-1">Total Supporters</div>
                            </div>
                        </GlassCard>

                        <GlassCard hoverEffect className="flex flex-col justify-between h-full min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                                    <Trophy size={24} />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">#1</div>
                                <div className="text-sm text-slate-400 mt-1">Ranked Dept.</div>
                                <div className="text-xs text-purple-400 mt-1">Computer Science</div>
                            </div>
                        </GlassCard>

                        <GlassCard hoverEffect className="flex flex-col justify-between h-full min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
                                    <Heart size={24} />
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">$45</div>
                                <div className="text-sm text-slate-400 mt-1">Avg. Contribution</div>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Right Column: Recent Activity & Profile (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* User Profile Widget */}
                    <UserProfile />

                    {/* Recent Activity Feed */}
                    <GlassCard className="h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Live Activity
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {RECENT_DONORS.map((donor, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                                            {donor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">{donor.name}</div>
                                            <div className="text-xs text-slate-500">{donor.time}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-green-400">+${donor.amount}</div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Full Width Leaderboard Section */}
            <div className="pt-12">
                <DepartmentLeaderboard />
            </div>
        </div>
    );
}
