"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Plus,
    Save,
    Building2,
    Users,
    UserPlus,
    Clock,
    IndianRupee,
    Check
} from "lucide-react";

interface Department {
    id: string;
    name: string;
    _count?: {
        students: number;
    };
}

interface Student {
    id: string;
    name: string;
    amountPaid: number;
    department: {
        name: string;
    };
}

interface AdminContentProps {
    departments: Department[];
    recentStudents: Student[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function AdminContent({ departments, recentStudents }: AdminContentProps) {
    const router = useRouter();

    // Student form state
    const [studentName, setStudentName] = useState("");
    const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
    const [amountPaid, setAmountPaid] = useState("");
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentMessage, setStudentMessage] = useState("");

    // Update payment state
    const [selectedDeptForUpdate, setSelectedDeptForUpdate] = useState(""); // Department filter
    const [selectedStudent, setSelectedStudent] = useState("");
    const [additionalAmount, setAdditionalAmount] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");

    // Department form state
    const [deptName, setDeptName] = useState("");
    const [deptLoading, setDeptLoading] = useState(false);
    const [deptMessage, setDeptMessage] = useState("");

    // Filter students by selected department
    const filteredStudents = selectedDeptForUpdate
        ? recentStudents.filter(s => {
            const studentDept = departments.find(d => d.name === s.department.name);
            return studentDept?.id === selectedDeptForUpdate;
        })
        : [];

    // Auto-select first department when departments list changes
    useEffect(() => {
        if (departments.length > 0 && !departmentId) {
            setDepartmentId(departments[0].id);
        }
    }, [departments, departmentId]);

    // Reset student selection when department changes
    useEffect(() => {
        setSelectedStudent("");
    }, [selectedDeptForUpdate]);

    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStudentLoading(true);
        setStudentMessage("");

        if (!departmentId || departmentId === "") {
            setStudentMessage("Error: Please select a department");
            setStudentLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/admin/student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: studentName.trim(),
                    departmentId: departmentId,
                    amountPaid: Number(amountPaid) || 0,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStudentMessage("✓ Student added successfully!");
                setStudentName("");
                setAmountPaid("");
                router.refresh();
                // Clear message after 3 seconds
                setTimeout(() => setStudentMessage(""), 3000);
            } else {
                setStudentMessage(`Error: ${data.error || "Failed to add student"}`);
            }
        } catch (error) {
            setStudentMessage("Network error occurred");
        } finally {
            setStudentLoading(false);
        }
    };

    const handleUpdatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateMessage("");

        if (!selectedStudent) {
            setUpdateMessage("Error: Please select a student");
            setUpdateLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/admin/update-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: selectedStudent,
                    amount: Number(additionalAmount) || 0,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setUpdateMessage(`✓ Added ${formatCurrency(Number(additionalAmount))} - New total: ${formatCurrency(data.newTotal)}`);
                setAdditionalAmount("");
                setSelectedStudent("");
                router.refresh();
                setTimeout(() => setUpdateMessage(""), 4000);
            } else {
                setUpdateMessage(`Error: ${data.error || "Failed to update"}`);
            }
        } catch (error) {
            setUpdateMessage("Network error occurred");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeptLoading(true);
        setDeptMessage("");

        try {
            const res = await fetch("/api/admin/department", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: deptName }),
            });

            const data = await res.json();

            if (res.ok) {
                setDeptMessage("✓ Department added!");
                setDeptName("");
                router.refresh();
                setTimeout(() => setDeptMessage(""), 3000);
            } else {
                setDeptMessage(`Error: ${data.error || "Failed to add"}`);
            }
        } catch (error) {
            setDeptMessage("Network error occurred");
        } finally {
            setDeptLoading(false);
        }
    };

    // Get selected student info
    const selectedStudentInfo = recentStudents.find(s => s.id === selectedStudent);

    return (
        <main className="main-content">
            {/* Header */}
            <motion.div
                className="welcome-section"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="welcome-title">
                        Admin Panel
                        <span>Manage students and payments</span>
                    </h1>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                className="admin-stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    marginBottom: '32px'
                }}
            >
                <div className="stat-card">
                    <div className="stat-icon">
                        <Building2 size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{departments.length}</span>
                        <span className="stat-label">Departments</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        <Users size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">
                            {departments.reduce((acc, d) => acc + (d._count?.students || 0), 0)}
                        </span>
                        <span className="stat-label">Total Students</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <IndianRupee size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">
                            {formatCurrency(recentStudents.reduce((acc, s) => acc + s.amountPaid, 0))}
                        </span>
                        <span className="stat-label">Recent Collection</span>
                    </div>
                </div>
            </motion.div>

            {/* Forms Grid - 3 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {/* Add Student Form */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="admin-card-title">Add New Student</h2>
                    </div>

                    <form onSubmit={handleStudentSubmit} className="admin-form">
                        <div className="form-group">
                            <label className="form-label">Student Name</label>
                            <input
                                type="text"
                                required
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="form-input"
                                placeholder="Enter name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="form-select"
                            >
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Initial Amount (₹)</label>
                            <input
                                type="number"
                                min="0"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                className="form-input"
                                placeholder="0"
                            />
                        </div>

                        <button type="submit" className="form-btn primary" disabled={studentLoading}>
                            <Save size={18} />
                            {studentLoading ? "Saving..." : "Add Student"}
                        </button>

                        {studentMessage && (
                            <div className={`form-message ${studentMessage.includes('Error') ? 'error' : 'success'}`}>
                                {studentMessage}
                            </div>
                        )}
                    </form>
                </motion.div>

                {/* Update Payment Form - NEW */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                            <IndianRupee size={20} />
                        </div>
                        <h2 className="admin-card-title">Update Payment</h2>
                    </div>

                    <form onSubmit={handleUpdatePayment} className="admin-form">
                        <div className="form-group">
                            <label className="form-label">1. Select Department</label>
                            <select
                                value={selectedDeptForUpdate}
                                onChange={(e) => setSelectedDeptForUpdate(e.target.value)}
                                className="form-select"
                            >
                                <option value="">-- Choose department --</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name} ({dept._count?.students || 0} students)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">2. Select Student</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="form-select"
                                required
                                disabled={!selectedDeptForUpdate}
                            >
                                <option value="">{selectedDeptForUpdate ? '-- Choose student --' : '-- Select department first --'}</option>
                                {filteredStudents.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} - {formatCurrency(student.amountPaid)}
                                    </option>
                                ))}
                            </select>
                            {selectedDeptForUpdate && filteredStudents.length === 0 && (
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    No students in this department
                                </p>
                            )}
                        </div>

                        {selectedStudentInfo && (
                            <div className="selected-student-info">
                                <span className="info-label">Current Amount:</span>
                                <span className="info-value">{formatCurrency(selectedStudentInfo.amountPaid)}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">3. Add Amount (₹)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={additionalAmount}
                                onChange={(e) => setAdditionalAmount(e.target.value)}
                                className="form-input"
                                placeholder="Enter amount to add"
                                disabled={!selectedStudent}
                            />
                        </div>

                        {selectedStudentInfo && additionalAmount && (
                            <div className="new-total-preview">
                                <span>New Total:</span>
                                <span className="new-amount">
                                    {formatCurrency(selectedStudentInfo.amountPaid + Number(additionalAmount))}
                                </span>
                            </div>
                        )}

                        <button type="submit" className="form-btn success" disabled={updateLoading || !selectedStudent}>
                            <Check size={18} />
                            {updateLoading ? "Updating..." : "Update Payment"}
                        </button>

                        {updateMessage && (
                            <div className={`form-message ${updateMessage.includes('Error') ? 'error' : 'success'}`}>
                                {updateMessage}
                            </div>
                        )}
                    </form>
                </motion.div>

                {/* Add Department Form */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon" style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                            <Building2 size={20} />
                        </div>
                        <h2 className="admin-card-title">Add Department</h2>
                    </div>

                    <form onSubmit={handleDeptSubmit} className="admin-form">
                        <div className="form-group">
                            <label className="form-label">Department Name</label>
                            <input
                                type="text"
                                required
                                value={deptName}
                                onChange={(e) => setDeptName(e.target.value)}
                                className="form-input"
                                placeholder="e.g., Computer Science"
                            />
                        </div>

                        <button type="submit" className="form-btn primary" disabled={deptLoading}>
                            <Plus size={18} />
                            {deptLoading ? "Adding..." : "Add Department"}
                        </button>

                        {deptMessage && (
                            <div className={`form-message ${deptMessage.includes('Error') ? 'error' : 'success'}`}>
                                {deptMessage}
                            </div>
                        )}
                    </form>

                    {/* Department List */}
                    <div className="dept-list">
                        <h3 className="dept-list-title">Current Departments</h3>
                        {departments.map((dept) => (
                            <div key={dept.id} className="dept-item">
                                <span className="dept-item-name">{dept.name}</span>
                                <span className="dept-item-count">{dept._count?.students || 0}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Students */}
            <motion.div
                className="admin-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="admin-card-header">
                    <div className="admin-card-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <Clock size={20} />
                    </div>
                    <h2 className="admin-card-title">All Students</h2>
                </div>

                <div className="recent-list">
                    {recentStudents.map((student) => (
                        <div key={student.id} className="recent-item">
                            <div className="recent-info">
                                <span className="recent-name">{student.name}</span>
                                <span className="recent-dept">{student.department.name}</span>
                            </div>
                            <span className="recent-amount">{formatCurrency(student.amountPaid)}</span>
                        </div>
                    ))}
                    {recentStudents.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                            No students yet
                        </p>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
