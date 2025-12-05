"use client";

import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { TransactionsPanel } from "@/components/transactions-panel";

interface DashboardData {
    stats: {
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
    return (
        <div className="app-wrapper">
            <div className="app-container">
                <Sidebar />
                <MainContent data={initialData} />
                <TransactionsPanel students={initialData.students} />
            </div>
        </div>
    );
}
