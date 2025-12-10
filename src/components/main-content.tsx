"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { RollingNumber } from "@/components/ui/rolling-number";

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

interface MainContentProps {
    data: DashboardData;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function MainContent({ data }: MainContentProps) {
    const { stats, departments } = data;
    const progressPercentage = Math.min((stats.totalCollected / stats.goal) * 100, 100);

    // Sort departments by collected amount
    const sortedDepts = [...departments]
        .sort((a, b) => b.totalCollected - a.totalCollected);

    return (
        <main className="main-content">
            {/* Welcome Section */}
            <motion.div
                className="welcome-section"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="welcome-title">
                    Fund Overview
                    <span>Track collection progress</span>
                </h1>
            </motion.div>

            {/* Balance Card - With Milestones */}
            <motion.div
                className="balance-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className="balance-header">
                    <p className="balance-label">Total Collected</p>
                    <div className="balance-badge">
                        <TrendingUp size={14} />
                        <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                </div>
                <motion.span
                    className="balance-amount"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <RollingNumber value={stats.totalCollected} prefix="₹" />
                </motion.span>
                <div className="balance-goal">
                    of {formatCurrency(stats.goal)} goal
                </div>

                {/* Progress Bar with Milestones */}
                <div className="progress-container">
                    <div className="balance-progress">
                        <motion.div
                            className="balance-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                        {/* Milestone Markers */}
                        <div className="milestone-marker" style={{ left: '25%' }} />
                        <div className="milestone-marker" style={{ left: '50%' }} />
                        <div className="milestone-marker" style={{ left: '75%' }} />
                    </div>
                    <div className="milestone-labels">
                        <span className={progressPercentage >= 25 ? 'reached' : ''}>25%</span>
                        <span className={progressPercentage >= 50 ? 'reached' : ''}>50%</span>
                        <span className={progressPercentage >= 75 ? 'reached' : ''}>75%</span>
                        <span className={progressPercentage >= 100 ? 'reached' : ''}>100%</span>
                    </div>
                </div>
            </motion.div>

            {/* Top Contributors - Above Departments */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <div className="section-header">
                    <h2 className="section-title">Top Contributors</h2>
                </div>

                <div className="contributors-card">
                    {stats.topStudents.slice(0, 5).map((student, index) => (
                        <motion.div
                            key={student.id}
                            className="contributor-row"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                        >
                            <div className="contributor-rank">{index + 1}</div>
                            <div className="contributor-avatar">
                                {student.name.charAt(0)}
                            </div>
                            <div className="contributor-info">
                                <span className="contributor-name">{student.name}</span>
                                <span className="text-xs text-muted-foreground">{student.admissionNumber}</span>
                                <span className="contributor-dept">{student.department}</span>
                            </div>
                            <span className="contributor-amount">{formatCurrency(student.amount)}</span>
                        </motion.div>
                    ))}
                    {stats.topStudents.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                            No contributors yet
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Departments Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                <div className="section-header">
                    <h2 className="section-title">Departments</h2>
                </div>

                <div className="cards-grid">
                    {sortedDepts.map((dept, index) => {
                        const target = dept.studentCount * 5000; // ₹5000 per student
                        const percentage = target > 0 ? Math.min((dept.totalCollected / target) * 100, 100) : 0;

                        return (
                            <Link href={`/department/${dept.id}`} key={dept.id} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    className="dept-card"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.45 + index * 0.08 }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="dept-icon">
                                        <Users size={18} />
                                    </div>
                                    <h3 className="dept-name">{dept.name}</h3>
                                    <p className="dept-meta">
                                        {dept.studentCount} students • Target: {formatCurrency(target)}
                                    </p>
                                    <p className="dept-amount">{formatCurrency(dept.totalCollected)}</p>
                                    <div className="dept-progress">
                                        <motion.div
                                            className="dept-progress-bar"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                                        />
                                    </div>
                                    <p className="dept-percentage">{percentage.toFixed(0)}% complete</p>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </main>
    );
}
