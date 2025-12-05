"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft } from "lucide-react";

interface Student {
    id: string;
    name: string;
    amountPaid: number;
    target: number;
    status: string;
    department: {
        name: string;
    };
}

interface TransactionsPanelProps {
    students: Student[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function getDateLabel(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
}

export function TransactionsPanel({ students }: TransactionsPanelProps) {
    return (
        <aside className="right-panel">
            {/* Header */}
            <div className="panel-header">
                <h2 className="panel-title">Recent Activity</h2>
            </div>

            {/* Date Label */}
            <p className="date-label">{getDateLabel()}</p>

            {/* Activity List */}
            <motion.div
                className="transaction-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {students.slice(0, 10).map((student, index) => (
                    <motion.div
                        key={student.id}
                        className="transaction-item"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <div className="transaction-left">
                            <div className="transaction-icon positive">
                                <ArrowDownLeft size={16} />
                            </div>
                            <div className="transaction-info">
                                <span className="transaction-name">{student.name}</span>
                                <span className="transaction-dept">{student.department.name}</span>
                            </div>
                        </div>
                        <span className="transaction-amount positive">
                            {formatCurrency(student.amountPaid)}
                        </span>
                    </motion.div>
                ))}

                {students.length === 0 && (
                    <p style={{
                        textAlign: 'center',
                        padding: '32px 16px',
                        color: 'var(--text-muted)',
                        fontSize: '14px'
                    }}>
                        No recent activity
                    </p>
                )}
            </motion.div>
        </aside>
    );
}
