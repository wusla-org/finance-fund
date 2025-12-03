"use client";

import { motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Bell, Search } from "lucide-react";

interface HeroStatsProps {
    totalCollected: number;
    goal: number;
}

export function HeroStats({ totalCollected, goal }: HeroStatsProps) {
    const percentage = Math.min((totalCollected / goal) * 100, 100);

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
                {/* Main Credit Card Widget */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 fintech-card flex flex-col justify-between min-h-[240px]"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 font-medium mb-1">Total Balance</p>
                            <h2 className="text-4xl font-bold tracking-tight">₹{(totalCollected / 1000).toFixed(1)}k</h2>
                        </div>
                        <CreditCard className="text-white/80" size={32} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-blue-100">
                            <span>**** **** **** 4289</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">VISA</span>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs text-blue-100 mb-2">
                                <span>Campaign Goal</span>
                                <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions & Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quick Actions Panel */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="content-panel flex flex-col justify-center"
                    >
                        <h3 className="font-bold text-gray-800 mb-6">Quick Actions</h3>
                        <div className="flex justify-between gap-4">
                            {[
                                { icon: ArrowUpRight, label: "Transfer", color: "bg-blue-50 text-blue-600" },
                                { icon: ArrowDownLeft, label: "Request", color: "bg-emerald-50 text-emerald-600" },
                                { icon: Plus, label: "Top Up", color: "bg-purple-50 text-purple-600" },
                                { icon: Wallet, label: "Wallet", color: "bg-orange-50 text-orange-600" }
                            ].map((action) => (
                                <div key={action.label} className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                                        <action.icon size={24} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{action.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Monthly Stats Panel */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="content-panel flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Statistics</h3>
                            <select className="text-xs bg-gray-100 border-none rounded-lg px-2 py-1 text-gray-600 outline-none">
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {[40, 70, 45, 90, 60, 80].map((h, i) => (
                                <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group overflow-hidden">
                                    <div 
                                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
