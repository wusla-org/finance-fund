"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Database,
    Users,
    Building2,
    Trash2,
    AlertTriangle,
    Search,
    DollarSign,
    Activity
} from "lucide-react";

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

interface Department {
    id: string;
    name: string;
    _count?: {
        students: number;
    };
}

interface Stats {
    totalStudents: number;
    totalDepts: number;
    totalCollected: number;
    totalContributions: number;
}

interface DeveloperContentProps {
    students: Student[];
    departments: Department[];
    stats: Stats;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function DeveloperContent({ students, departments, stats }: DeveloperContentProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
    const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);
    const [deletingAll, setDeletingAll] = useState(false);

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Delete single student - INSTANT DELETE (no confirmation)
    async function deleteStudent(id: string, name: string) {
        console.log("=== DELETING ===", name);

        setDeletingStudentId(id);
        try {
            const response = await fetch("/api/admin/student", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: [id] }),
            });
            console.log("Response:", response.status);

            if (response.ok) {
                console.log("DELETED!");
                router.refresh();
            } else {
                window.alert("Failed");
            }
        } catch (err) {
            console.error(err);
            window.alert("Error");
        } finally {
            setDeletingStudentId(null);
        }
    }

    // Delete ALL students - INSTANT
    async function deleteAllStudents() {
        console.log("=== DELETING ALL ===");

        setDeletingAll(true);
        try {
            const response = await fetch("/api/admin/student", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deleteAll: true }),
            });

            if (response.ok) {
                console.log("ALL DELETED!");
                router.refresh();
            } else {
                window.alert("Failed");
            }
        } catch (err) {
            window.alert("Error");
        } finally {
            setDeletingAll(false);
        }
    }

    // Delete department - INSTANT
    async function deleteDepartment(id: string, name: string) {
        console.log("=== DELETING DEPT ===", name);

        setDeletingDeptId(id);
        try {
            const response = await fetch("/api/admin/department", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                console.log("DEPT DELETED!");
                router.refresh();
            } else {
                window.alert("Failed");
            }
        } catch (err) {
            window.alert("Error");
        } finally {
            setDeletingDeptId(null);
        }
    }

    return (
        <main className="main-content">
            {/* Header */}
            <motion.div
                className="welcome-section"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Database size={28} style={{ color: 'var(--primary)' }} />
                        Developer Console
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Advanced data management • <span style={{ color: '#c54949' }}>Handle with care</span>
                    </p>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    marginBottom: '32px'
                }}
            >
                <div className="stat-card">
                    <div className="stat-icon">
                        <Database size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalDepts}</span>
                        <span className="stat-label">Departments</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                        <Users size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalStudents}</span>
                        <span className="stat-label">Students</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        <DollarSign size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{formatCurrency(stats.totalCollected)}</span>
                        <span className="stat-label">Collected</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <Activity size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalContributions}</span>
                        <span className="stat-label">Transactions</span>
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Students Table */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="admin-card-header" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="admin-card-icon" style={{ background: 'rgba(197, 73, 73, 0.1)', color: '#c54949' }}>
                                <Users size={20} />
                            </div>
                            <h2 className="admin-card-title">Student Data ({students.length})</h2>
                        </div>
                        {students.length > 0 && (
                            <button
                                onClick={deleteAllStudents}
                                disabled={deletingAll}
                                className="delete-all-btn"
                            >
                                <Trash2 size={14} />
                                {deletingAll ? "Deleting..." : "Delete All"}
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="search-box">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Table */}
                    <div className="data-table">
                        <div className="table-header">
                            <span style={{ flex: 1 }}>Name</span>
                            <span style={{ width: '140px' }}>Department</span>
                            <span style={{ width: '90px', textAlign: 'right' }}>Amount</span>
                            <span style={{ width: '80px', textAlign: 'center' }}>Status</span>
                            <span style={{ width: '60px', textAlign: 'center' }}>Delete</span>
                        </div>
                        <div className="table-body">
                            {filteredStudents.map((student) => (
                                <div key={student.id} className="table-row">
                                    <span className="row-name" style={{ flex: 1 }}>{student.name}</span>
                                    <span className="row-dept" style={{ width: '140px' }}>{student.department.name}</span>
                                    <span className="row-amount" style={{ width: '90px', textAlign: 'right' }}>
                                        {formatCurrency(student.amountPaid)}
                                    </span>
                                    <span style={{ width: '80px', textAlign: 'center' }}>
                                        <span className={`status-badge ${student.status.toLowerCase()}`}>
                                            {student.status}
                                        </span>
                                    </span>
                                    <span style={{ width: '60px', textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => deleteStudent(student.id, student.name)}
                                            disabled={deletingStudentId === student.id}
                                            className="delete-btn"
                                        >
                                            {deletingStudentId === student.id ? "..." : <Trash2 size={14} />}
                                        </button>
                                    </span>
                                </div>
                            ))}
                            {filteredStudents.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    No students found
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Departments Panel */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon" style={{ background: 'rgba(197, 73, 73, 0.1)', color: '#c54949' }}>
                            <Building2 size={20} />
                        </div>
                        <h2 className="admin-card-title">Manage Departments</h2>
                    </div>

                    <div className="dept-manage-list">
                        {departments.map((dept) => (
                            <div key={dept.id} className="dept-manage-item">
                                <div className="dept-manage-info">
                                    <span className="dept-manage-name">{dept.name}</span>
                                    <span className="dept-manage-count">{dept._count?.students || 0} students</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => deleteDepartment(dept.id, dept.name)}
                                    disabled={deletingDeptId === dept.id}
                                    className="delete-btn"
                                >
                                    {deletingDeptId === dept.id ? "..." : <Trash2 size={14} />}
                                </button>
                            </div>
                        ))}
                        {departments.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                No departments found
                            </div>
                        )}
                    </div>

                    <div className="warning-box">
                        <AlertTriangle size={18} />
                        <p>Deleting a department removes all students and data permanently.</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
