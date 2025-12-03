"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Trophy, Users, Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface DepartmentStats {
    name: string;
    total: number;
    count: number;
    topDonors: {
        id: string;
        name: string;
        contributions: number;
    }[];
}

export function DepartmentLeaderboard() {
    const [departments, setDepartments] = useState<DepartmentStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/leaderboard');
            if (res.ok) {
                const data = await res.json();
                setDepartments(data);
            }
        } catch (e) {
            console.error("Failed to fetch leaderboard", e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
            </div>
        );
    }

    const topThree = departments.slice(0, 3);
    const runnersUp = departments.slice(3);

    return (
        <div className="space-y-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 inline-flex items-center gap-3">
                    <Trophy className="text-yellow-500" size={40} /> Department Rankings
                </h2>
                <p className="text-slate-400 mt-2 text-lg">The race to the top is on!</p>
            </div>

            {/* Podium Section */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 min-h-[400px] px-4">
                {/* 2nd Place */}
                {topThree[1] && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-1/3 order-2 md:order-1"
                    >
                        <GlassCard className="flex flex-col items-center p-6 border-slate-400/30 bg-slate-800/20 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-slate-400" />
                            <div className="mb-4 text-slate-400">
                                <Medal size={40} />
                            </div>
                            <div className="text-2xl font-bold text-center mb-1">{topThree[1].name}</div>
                            <div className="text-green-400 font-mono font-bold text-xl">${topThree[1].total.toLocaleString()}</div>
                            <div className="mt-4 text-sm text-slate-500 flex items-center gap-1">
                                <Users size={14} /> {topThree[1].count} contributors
                            </div>
                            <div className="mt-6 w-full space-y-2">
                                <div className="text-xs font-bold text-slate-500 uppercase text-center">Top Contributor</div>
                                <div className="bg-slate-900/50 p-2 rounded text-center text-sm truncate">
                                    {topThree[1].topDonors[0]?.name || "Anonymous"}
                                </div>
                            </div>
                        </GlassCard>
                        <div className="h-24 md:h-32 bg-gradient-to-t from-slate-800/50 to-transparent mx-4 rounded-b-xl" />
                    </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full md:w-1/3 order-1 md:order-2 z-10 -mt-12 md:-mt-0"
                    >
                        <div className="flex justify-center mb-4">
                            <Crown size={60} className="text-yellow-500 animate-bounce" fill="currentColor" />
                        </div>
                        <GlassCard className="flex flex-col items-center p-8 border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden transform scale-105">
                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
                            <div className="absolute top-0 inset-x-0 h-1 bg-yellow-500" />

                            <div className="text-3xl font-black text-center mb-2 text-white text-glow">{topThree[0].name}</div>
                            <div className="text-4xl font-black text-yellow-400 font-mono mb-2">${topThree[0].total.toLocaleString()}</div>
                            <div className="text-yellow-200/70 text-sm flex items-center gap-1 mb-6">
                                <Users size={16} /> {topThree[0].count} contributors
                            </div>

                            <div className="w-full bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-xs font-bold text-yellow-500 uppercase text-center mb-2 tracking-wider">MVP Donors</div>
                                {topThree[0].topDonors.slice(0, 3).map((donor, i) => (
                                    <div key={donor.id} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
                                        <span className="text-slate-300">{i + 1}. {donor.name}</span>
                                        <span className="text-yellow-400 font-mono">${donor.contributions}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                        <div className="h-32 md:h-48 bg-gradient-to-t from-yellow-900/20 to-transparent mx-4 rounded-b-xl" />
                    </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full md:w-1/3 order-3"
                    >
                        <GlassCard className="flex flex-col items-center p-6 border-amber-700/30 bg-amber-900/10 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-amber-700" />
                            <div className="mb-4 text-amber-700">
                                <Medal size={40} />
                            </div>
                            <div className="text-2xl font-bold text-center mb-1">{topThree[2].name}</div>
                            <div className="text-amber-500 font-mono font-bold text-xl">${topThree[2].total.toLocaleString()}</div>
                            <div className="mt-4 text-sm text-slate-500 flex items-center gap-1">
                                <Users size={14} /> {topThree[2].count} contributors
                            </div>
                            <div className="mt-6 w-full space-y-2">
                                <div className="text-xs font-bold text-slate-500 uppercase text-center">Top Contributor</div>
                                <div className="bg-slate-900/50 p-2 rounded text-center text-sm truncate">
                                    {topThree[2].topDonors[0]?.name || "Anonymous"}
                                </div>
                            </div>
                        </GlassCard>
                        <div className="h-16 md:h-24 bg-gradient-to-t from-slate-800/50 to-transparent mx-4 rounded-b-xl" />
                    </motion.div>
                )}
            </div>

            {/* Runners Up List */}
            {runnersUp.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {runnersUp.map((dept, index) => (
                        <GlassCard key={dept.name} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                    #{index + 4}
                                </div>
                                <div>
                                    <div className="font-bold">{dept.name}</div>
                                    <div className="text-xs text-slate-500">{dept.count} contributors</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-400">${dept.total.toLocaleString()}</div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
