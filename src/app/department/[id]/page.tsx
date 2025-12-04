import { prisma } from "@/lib/db";
import { StudentTable } from "@/components/student-table";
import Link from "next/link";
import { ArrowLeft, Trophy, Users, TrendingUp, Target, Award } from "lucide-react";
import { notFound } from "next/navigation";

interface DepartmentPageProps {
    params: Promise<{
        id: string;
    }>;
}

import type { Viewport } from "next";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
    themeColor: "#0f172a",
};

async function getDepartment(id: string) {
    const department = await prisma.department.findUnique({
        where: { id },
        include: {
            students: {
                include: {
                    department: true,
                },
                orderBy: {
                    name: "asc",
                },
            },
        },
    });

    if (!department) return null;

    const studentCount = department.students.length;
    // Rule: 5k per student target
    const target = studentCount * 5000;
    const totalCollected = department.students.reduce((acc: number, s: { amountPaid: number }) => acc + s.amountPaid, 0);

    return {
        ...department,
        totalCollected,
        target: target > 0 ? target : 5000,
    };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
    const { id } = await params;
    const department = await getDepartment(id);

    if (!department) {
        notFound();
    }

    const percentage = Math.min((department.totalCollected / department.target) * 100, 100);
    const participationCount = department.students.filter(s => s.amountPaid > 0).length;
    const participationRate = department.students.length > 0 ? (participationCount / department.students.length) * 100 : 0;
    const averageContribution = participationCount > 0 ? department.totalCollected / participationCount : 0;

    // Determine Club Theme
    let club = "Base";
    let theme = {
        gradient: "from-slate-800 to-slate-900",
        text: "text-slate-100",
        accent: "text-slate-400",
        border: "border-slate-700",
        progress: "bg-slate-500",
        badge: "bg-slate-800 text-slate-300",
        icon: "text-slate-400"
    };

    if (percentage >= 100) {
        club = "Centenary Club";
        theme = {
            gradient: "from-purple-900/80 to-indigo-900/80",
            text: "text-purple-50",
            accent: "text-purple-200",
            border: "border-purple-500/30",
            progress: "bg-gradient-to-r from-purple-400 to-indigo-400",
            badge: "bg-purple-500/20 text-purple-200 border-purple-500/30",
            icon: "text-purple-400"
        };
    } else if (percentage >= 75) {
        club = "Platinum Club";
        theme = {
            gradient: "from-cyan-900/80 to-blue-900/80",
            text: "text-cyan-50",
            accent: "text-cyan-200",
            border: "border-cyan-500/30",
            progress: "bg-gradient-to-r from-cyan-400 to-blue-400",
            badge: "bg-cyan-500/20 text-cyan-200 border-cyan-500/30",
            icon: "text-cyan-400"
        };
    } else if (percentage >= 50) {
        club = "Golden Club";
        theme = {
            gradient: "from-amber-900/80 to-yellow-900/80",
            text: "text-amber-50",
            accent: "text-amber-200",
            border: "border-amber-500/30",
            progress: "bg-gradient-to-r from-amber-400 to-yellow-400",
            badge: "bg-amber-500/20 text-amber-200 border-amber-500/30",
            icon: "text-amber-400"
        };
    } else if (percentage >= 25) {
        club = "Silver Club";
        theme = {
            gradient: "from-slate-800 to-slate-900",
            text: "text-slate-50",
            accent: "text-slate-300",
            border: "border-slate-600/50",
            progress: "bg-gradient-to-r from-slate-400 to-gray-300",
            badge: "bg-slate-700/50 text-slate-200 border-slate-600/50",
            icon: "text-slate-400"
        };
    }

    return (
        <main className="min-h-screen py-12 bg-[#0a0a0a]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>

                    {/* Hero Card */}
                    <div className={`relative overflow-hidden rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradient} p-8 md:p-12 shadow-2xl`}>
                        {/* Background Glow */}
                        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none`} />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                            <div className="flex-1">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${theme.badge}`}>
                                    <Award size={14} />
                                    {club}
                                </div>
                                <h1 className={`text-4xl md:text-6xl font-serif font-bold mb-4 ${theme.text}`}>
                                    {department.name}
                                </h1>
                                <div className={`flex items-center gap-6 ${theme.accent}`}>
                                    <div className="flex items-center gap-2">
                                        <Users size={18} />
                                        <span className="font-medium">{department.students.length} Students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target size={18} />
                                        <span className="font-medium">Goal: ₹{(department.target / 1000).toFixed(0)}k</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end justify-center">
                                <div className={`text-sm font-bold uppercase tracking-widest mb-1 opacity-70 ${theme.text}`}>Total Collected</div>
                                <div className={`text-5xl md:text-7xl font-bold mb-2 ${theme.text} tracking-tight`}>
                                    ₹{department.totalCollected.toLocaleString('en-IN')}
                                </div>
                                <div className={`text-lg font-medium ${theme.accent}`}>
                                    {percentage.toFixed(1)}% Funded
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-12 relative">
                            <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                <div
                                    className={`h-full ${theme.progress} shadow-lg relative`}
                                    style={{ width: `${percentage}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-800 ${theme.icon}`}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Participation Rate</p>
                            <p className="text-2xl font-bold text-white">{participationRate.toFixed(0)}%</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-800 ${theme.icon}`}>
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Avg. Contribution</p>
                            <p className="text-2xl font-bold text-white">₹{averageContribution.toFixed(0)}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-800 ${theme.icon}`}>
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Top Contributor</p>
                            <p className="text-2xl font-bold text-white">
                                {department.students.length > 0
                                    ? department.students.reduce((prev, current) => (prev.amountPaid > current.amountPaid) ? prev : current).name.split(' ')[0]
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Student Table */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden p-1">
                    <StudentTable students={department.students} className="w-full" />
                </div>
            </div>
        </main>
    );
}
