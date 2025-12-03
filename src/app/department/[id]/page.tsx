import { prisma } from "@/lib/db";
import { StudentTable } from "@/components/student-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface DepartmentPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = "force-dynamic";

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

    return {
        ...department,
        totalCollected: department.students.reduce((acc: number, s: { amountPaid: number }) => acc + s.amountPaid, 0),
        target: department.students.reduce((acc: number, s: { target: number }) => acc + s.target, 0),
    };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
    const { id } = await params;
    const department = await getDepartment(id);

    if (!department) {
        notFound();
    }

    const percentage = Math.min((department.totalCollected / department.target) * 100, 100);

    return (
        <main className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>

                    <div className="premium-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                                    {department.name}
                                </h1>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <span className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700 text-sm">
                                        {department.students.length} Students
                                    </span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                    <span className="text-sm">Department Overview</span>
                                </div>
                            </div>

                            <div className="w-full md:w-auto text-right">
                                <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Total Collected</div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-1 text-glow-primary">
                                    ₹{department.totalCollected.toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-400 font-medium">
                                    Goal: <span className="text-slate-300">₹{department.target.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="flex justify-between text-sm mb-3 font-medium">
                                <span className="text-slate-400">Progress toward goal</span>
                                <span className="text-white">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <StudentTable students={department.students} />
            </div>
        </main>
    );
}
