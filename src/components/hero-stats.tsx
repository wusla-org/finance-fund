"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Bell, Search, TrendingUp } from "lucide-react";
import React, { useEffect } from "react";

interface HeroStatsProps {
    totalCollected: number;
    goal: number;
    topStudents: {
        id: string;
        name: string;
        amount: number;
        department: string;
    }[];
    dailyStats: {
        day: string;
        amount: number;
    }[];
}

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(current)
    );

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}

export function HeroStats({ totalCollected, goal, topStudents, dailyStats }: HeroStatsProps) {
    // Ensure goal is at least 1 to avoid division by zero
    const safeGoal = goal > 0 ? goal : 1000000;
    const percentage = Math.min((totalCollected / safeGoal) * 100, 100);

    // Determine Theme based on percentage
    const getTheme = (pct: number) => {
        if (pct >= 100) return {
            gradient: "bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500",
            text: "text-amber-950",
            subText: "text-amber-800",
            progressTrack: "bg-amber-900/20",
            progressFill: "bg-white",
            iconBg: "bg-amber-900/10",
            iconColor: "text-amber-900",
            shadow: "shadow-amber-500/50",
            isGold: true
        };
        if (pct >= 75) return {
            gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
            text: "text-white",
            subText: "text-emerald-100",
            progressTrack: "bg-black/20",
            progressFill: "bg-white",
            iconBg: "bg-white/20",
            iconColor: "text-white",
            shadow: "shadow-emerald-500/50",
            isGold: false
        };
        if (pct >= 50) return {
            gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
            text: "text-white",
            subText: "text-blue-100",
            progressTrack: "bg-black/20",
            progressFill: "bg-white",
            iconBg: "bg-white/20",
            iconColor: "text-white",
            shadow: "shadow-blue-500/50",
            isGold: false
        };
        if (pct >= 25) return {
            gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
            text: "text-white",
            subText: "text-amber-100",
            progressTrack: "bg-black/20",
            progressFill: "bg-white",
            iconBg: "bg-white/20",
            iconColor: "text-white",
            shadow: "shadow-orange-500/50",
            isGold: false
        };
        return {
            gradient: "bg-gradient-to-br from-red-500 to-rose-600",
            text: "text-white",
            subText: "text-rose-100",
            progressTrack: "bg-black/20",
            progressFill: "bg-white",
            iconBg: "bg-white/20",
            iconColor: "text-white",
            shadow: "shadow-red-500/50",
            isGold: false
        };
    };

    // Real-time polling
    const [stats, setStats] = React.useState({
        totalCollected,
        goal,
        topStudents,
        dailyStats
    });

    useEffect(() => {
        // Initial set from props
        setStats({ totalCollected, goal, topStudents, dailyStats });

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const newStats = await res.json();
                    setStats(newStats);
                }
            } catch (error) {
                console.error("Failed to poll stats:", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [totalCollected, goal, topStudents, dailyStats]);

    // Use local state for rendering
    const currentTotalCollected = stats.totalCollected;
    const currentGoal = stats.goal;
    const currentTopStudents = stats.topStudents;
    const currentDailyStats = stats.dailyStats;
    const currentPercentage = Math.min((currentTotalCollected / (currentGoal > 0 ? currentGoal : 1000000)) * 100, 100);
    const currentTheme = getTheme(currentPercentage);

    return (
        <div className="col-span-12 lg:col-span-12 mb-8">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center mb-8 text-white">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Overview of financial status</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                        <Search size={20} />
                    </div>
                    <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                        <Bell size={20} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white/20 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Profile" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Progress Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`lg:col-span-1 rounded-[24px] p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden transition-all duration-700 ${currentTheme.gradient} ${currentTheme.shadow} shadow-lg`}
                >
                    {/* Gold Shine Effect */}
                    {currentTheme.isGold && (
                        <motion.div
                            className="absolute inset-0 z-0"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                            }}
                        />
                    )}

                    {/* Background Progress Fill (Subtle Overlay) */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full bg-black/5 z-0"
                        initial={{ height: "0%" }}
                        animate={{ height: `${currentPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className={`${currentTheme.subText} font-medium mb-1`}>Total Collected</p>
                            <h2 className={`text-4xl font-bold tracking-tight ${currentTheme.text}`}>
                                <AnimatedNumber value={currentTotalCollected} />
                            </h2>
                        </div>
                        <div className={`${currentTheme.iconBg} p-2 rounded-xl backdrop-blur-sm`}>
                            <TrendingUp className={currentTheme.iconColor} size={24} />
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className={`flex items-center gap-4 text-sm ${currentTheme.subText}`}>
                            <div className="flex flex-col">
                                <span className="text-xs opacity-70">Target Goal</span>
                                <span className={`font-bold text-lg ${currentTheme.text}`}>
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(currentGoal > 0 ? currentGoal : 1000000)}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className={`flex justify-between text-xs ${currentTheme.subText} mb-2 font-medium`}>
                                <span>Progress</span>
                                <span>{currentPercentage.toFixed(2)}%</span>
                            </div>
                            <div className={`h-3 ${currentTheme.progressTrack} rounded-full overflow-hidden backdrop-blur-sm`}>
                                <motion.div
                                    className={`h-full ${currentTheme.progressFill} rounded-full shadow-sm`}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${currentPercentage}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions & Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Contributors Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="content-panel flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Top Contributors</h3>
                            <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View All</span>
                        </div>

                        <div className="flex-1 space-y-4">
                            {currentTopStudents.map((student, index) => (
                                <div key={student.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.department}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-800">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(student.amount)}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 text-xs text-emerald-500">
                                            <TrendingUp size={12} />
                                            <span>Top</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {currentTopStudents.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <p>No contributions yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Monthly Stats Panel - Growth Trends */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="content-panel flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <h3 className="font-bold text-gray-800">Growth Trends</h3>
                            <select className="text-xs bg-gray-100 border-none rounded-lg px-2 py-1 text-gray-600 outline-none">
                                <option>Weekly</option>
                            </select>
                        </div>

                        <div className="flex-1 w-full relative min-h-[120px] flex items-end">
                            {(() => {
                                const data = currentDailyStats.length > 0 ? currentDailyStats : Array(7).fill({ amount: 0, day: '' });
                                const maxVal = Math.max(...data.map(d => d.amount), 100);

                                // Generate points
                                const points = data.map((d, i) => {
                                    const x = (i / (data.length - 1)) * 100;
                                    const y = 100 - (d.amount / maxVal) * 80;
                                    return [x, y];
                                });

                                // Simple smoothing (Catmull-Rom-like via Bezier)
                                const smoothPath = (points: number[][]) => {
                                    if (points.length < 2) return "";
                                    let d = `M ${points[0][0]},${points[0][1]}`;
                                    for (let i = 0; i < points.length - 1; i++) {
                                        const [x0, y0] = i > 0 ? points[i - 1] : points[0];
                                        const [x1, y1] = points[i];
                                        const [x2, y2] = points[i + 1];
                                        const [x3, y3] = i < points.length - 2 ? points[i + 2] : points[i + 1];

                                        const cp1x = x1 + (x2 - x0) / 6;
                                        const cp1y = y1 + (y2 - y0) / 6;
                                        const cp2x = x2 - (x3 - x1) / 6;
                                        const cp2y = y2 - (y3 - y1) / 6;

                                        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
                                    }
                                    return d;
                                };

                                const linePath = smoothPath(points);
                                const areaPath = `${linePath} L 100,100 L 0,100 Z`;

                                // Dynamic colors based on theme
                                const chartColor = currentTheme.isGold ? "#d97706" : // amber-600
                                    currentPercentage >= 75 ? "#059669" : // emerald-600
                                        currentPercentage >= 50 ? "#2563EB" : // blue-600
                                            currentPercentage >= 25 ? "#ea580c" : // orange-600
                                                "#dc2626"; // red-600

                                return (
                                    <div className="absolute inset-0 w-full h-full">
                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                            <defs>
                                                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                                                </linearGradient>
                                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                            </defs>

                                            {/* Area Fill */}
                                            <motion.path
                                                d={areaPath}
                                                fill="url(#growthGradient)"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />

                                            {/* Line with Glow */}
                                            <motion.path
                                                d={linePath}
                                                fill="none"
                                                stroke={chartColor}
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                vectorEffect="non-scaling-stroke"
                                                filter="url(#glow)"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                            />
                                        </svg>

                                        {/* Data Points (HTML to avoid SVG stretching distortion) */}
                                        {points.map(([x, y], i) => (
                                            <div
                                                key={i}
                                                className="absolute group cursor-pointer"
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${y}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                <div
                                                    className="w-3 h-3 bg-white rounded-full border-2 transition-all duration-300 group-hover:scale-150 shadow-sm"
                                                    style={{ borderColor: chartColor }}
                                                />

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                                    <div className="flex flex-col items-center">
                                                        <div className="bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-xl whitespace-nowrap">
                                                            ₹{data[i].amount}
                                                        </div>
                                                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-800"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-4 relative z-10">
                            {currentDailyStats.map((stat, i) => (
                                <span key={i}>{stat.day}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
