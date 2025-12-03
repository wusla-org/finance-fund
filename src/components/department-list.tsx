"use client";

import { motion } from "framer-motion";
import { Users, ChevronRight, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Department {
    id: string;
    name: string;
    totalCollected: number;
    target: number;
    studentCount: number;
}

interface DepartmentListProps {
    departments: Department[];
}

export function DepartmentList({ departments }: DepartmentListProps) {
    return (
        <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Active Departments</h2>
                <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept, index) => {
                    const percentage = Math.min((dept.totalCollected / dept.target) * 100, 100);

                    return (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/department/${dept.id}`}>
                                <div className="content-panel group cursor-pointer hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Users size={20} />
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
                                            <TrendingUp size={12} />
                                            <span>{percentage.toFixed(0)}%</span>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                                        {dept.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {dept.studentCount} Students Enrolled
                                    </p>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Collected</p>
                                            <p className="text-xl font-bold text-gray-900">₹{(dept.totalCollected / 1000).toFixed(1)}k</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
