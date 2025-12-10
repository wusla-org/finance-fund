"use client";
// Initialized

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { TransactionsPanel } from "@/components/transactions-panel";
import { AutoRefresh } from "@/components/ui/auto-refresh";
import { Menu, GraduationCap } from "lucide-react";

interface DashboardData {
    stats: {
        totalCollected: number;
        goal: number;
        topStudents: {
            id: string;
            name: string;
            admissionNumber?: string | null;
            amount: number;
            department: string;
        }[];
        dailyStats: {
            day: string;
            amount: number;
        }[];
    };
    departments: {
        id: string;
        name: string;
        totalCollected: number;
        target: number;
        studentCount: number;
    }[];
    students: {
        id: string;
        name: string;
        amountPaid: number;
        target: number;
        status: string;
        department: {
            name: string;
        };
    }[];
}

interface DashboardViewProps {
    initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-wrapper relative">
            <AutoRefresh intervalMs={8000} />

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-black font-bold">
                        <GraduationCap size={18} />
                    </div>
                    <span className="font-bold text-[var(--text-main)]">Fund Tracker</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-main)]">
                    <Menu size={24} />
                </button>
            </div>

            <div className="app-container">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <MainContent data={initialData} />
                <TransactionsPanel students={initialData.students} />
            </div>
        </div>
    );
}
