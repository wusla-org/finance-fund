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
    Activity,
    Pencil
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface Student {
    id: string;
    name: string;
    admissionNumber?: string | null;
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

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<'student' | 'department' | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        admissionNumber: "",
        amountPaid: 0,
        departmentId: "",
    });

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.admissionNumber && s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- Edit Handlers ---
    function openEditStudent(student: Student) {
        setEditingType('student');
        setEditingItem(student);
        setFormData({
            name: student.name,
            admissionNumber: student.admissionNumber || "",
            amountPaid: student.amountPaid,
            departmentId: departments.find(d => d.name === student.department.name)?.id || "",
        });
        setIsEditModalOpen(true);
    }

    function openEditDept(dept: Department) {
        setEditingType('department');
        setEditingItem(dept);
        setFormData({
            name: dept.name,
            admissionNumber: "",
            amountPaid: 0,
            departmentId: "",
        });
        setIsEditModalOpen(true);
    }

    async function handleSave() {
        console.log("Saving...", editingType, formData); // DEBUG
        setIsSaving(true);
        try {
            let url = "";
            let body = {};

            if (editingType === 'student') {
                url = "/api/admin/student";
                body = {
                    id: editingItem.id,
                    name: formData.name,
                    admissionNumber: formData.admissionNumber,
                    amountPaid: Number(formData.amountPaid),
                    departmentId: formData.departmentId
                };
            } else {
                url = "/api/admin/department";
                body = {
                    id: editingItem.id,
                    name: formData.name
                };
            }

            console.log("Sending PUT to", url, body); // DEBUG

            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            console.log("Response:", response.status, data); // DEBUG

            if (!response.ok) {
                throw new Error(data.error || "Failed to update");
            }

            console.log("Refreshing router...");
            router.refresh();
            setIsEditModalOpen(false);
            // Optional: Show success toast/alert
        } catch (error) {
            console.error("Save Error:", error);
            alert(`Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    }

    // ... existing delete functions ...
    // Delete single student
    async function deleteStudent(id: string, name: string) {
        if (!confirm(`Delete student ${name}?`)) return; // Added safety check
        setDeletingStudentId(id);
        try {
            await fetch("/api/admin/student", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: [id] }),
            });
            router.refresh();
        } catch (err) { alert("Error"); } finally { setDeletingStudentId(null); }
    }

    async function deleteAllStudents() {
        if (!confirm("Are you sure you want to DELETE ALL STUDENTS? This cannot be undone.")) return;
        setDeletingAll(true);
        try {
            await fetch("/api/admin/student", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deleteAll: true }),
            });
            router.refresh();
        } catch (err) { alert("Error"); } finally { setDeletingAll(false); }
    }

    async function deleteDepartment(id: string, name: string) {
        if (!confirm(`Delete department ${name} and all its students?`)) return;
        setDeletingDeptId(id);
        try {
            await fetch("/api/admin/department", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            router.refresh();
        } catch (err) { alert("Error"); } finally { setDeletingDeptId(null); }
    }


    return (
        <main className="main-content">
            {/* Header & Stats - Keep as is (abbreviated for this tool call, assume previous structure) */}
            <motion.div className="welcome-section" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Database size={28} style={{ color: 'var(--primary)' }} /> Developer Console
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Advanced data management • <span style={{ color: '#c54949' }}>Handle with care</span>
                    </p>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div className="stat-card">
                    <div className="stat-icon"><Database size={20} /></div>
                    <div className="stat-info"><span className="stat-value">{stats.totalDepts}</span><span className="stat-label">Departments</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}><Users size={20} /></div>
                    <div className="stat-info"><span className="stat-value">{stats.totalStudents}</span><span className="stat-label">Students</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}><DollarSign size={20} /></div>
                    <div className="stat-info"><span className="stat-value">{formatCurrency(stats.totalCollected)}</span><span className="stat-label">Collected</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}><Activity size={20} /></div>
                    <div className="stat-info"><span className="stat-value">{stats.totalContributions}</span><span className="stat-label">Transactions</span></div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Students Table */}
                <motion.div className="admin-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="admin-card-header" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="admin-card-icon" style={{ background: 'rgba(197, 73, 73, 0.1)', color: '#c54949' }}><Users size={20} /></div>
                            <h2 className="admin-card-title">Student Data ({students.length})</h2>
                        </div>
                        {students.length > 0 && (
                            <button onClick={deleteAllStudents} disabled={deletingAll} className="delete-all-btn">
                                <Trash2 size={14} /> {deletingAll ? "Deleting..." : "Delete All"}
                            </button>
                        )}
                    </div>

                    <div className="search-box">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    </div>

                    <div className="data-table">
                        <div className="table-header">
                            <span style={{ width: '90px' }}>CIC No.</span>
                            <span style={{ flex: 1 }}>Name</span>
                            <span style={{ width: '120px' }}>Department</span>
                            <span style={{ width: '80px', textAlign: 'right' }}>Amount</span>
                            <span style={{ width: '90px', textAlign: 'center' }}>Actions</span>
                        </div>
                        <div className="table-body">
                            {filteredStudents.map((student) => (
                                <div key={student.id} className="table-row">
                                    <span className="row-cic" style={{ width: '90px', fontSize: '12px', color: 'var(--text-secondary)' }}>{student.admissionNumber || '-'}</span>
                                    <span className="row-name" style={{ flex: 1 }}>{student.name}</span>
                                    <span className="row-dept" style={{ width: '120px' }}>{student.department.name}</span>
                                    <span className="row-amount" style={{ width: '80px', textAlign: 'right' }}>{formatCurrency(student.amountPaid)}</span>
                                    <span style={{ width: '90px', textAlign: 'center', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                        <button onClick={() => openEditStudent(student)} className="icon-btn-sm" title="Edit">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => deleteStudent(student.id, student.name)} disabled={deletingStudentId === student.id} className="icon-btn-sm danger" title="Delete">
                                            {deletingStudentId === student.id ? "..." : <Trash2 size={14} />}
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Departments Panel */}
                <motion.div className="admin-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="admin-card-header">
                        <div className="admin-card-icon" style={{ background: 'rgba(197, 73, 73, 0.1)', color: '#c54949' }}><Building2 size={20} /></div>
                        <h2 className="admin-card-title">Departments</h2>
                    </div>
                    <div className="dept-manage-list">
                        {departments.map((dept) => (
                            <div key={dept.id} className="dept-manage-item">
                                <div className="dept-manage-info">
                                    <span className="dept-manage-name">{dept.name}</span>
                                    <span className="dept-manage-count">{dept._count?.students || 0} students</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => openEditDept(dept)} className="icon-btn-sm" title="Edit">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => deleteDepartment(dept.id, dept.name)} disabled={deletingDeptId === dept.id} className="icon-btn-sm danger">
                                        {deletingDeptId === dept.id ? "..." : <Trash2 size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={editingType === 'student' ? 'Edit Student' : 'Edit Department'}
            >
                <div className="admin-form">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {editingType === 'student' && (
                        <>
                            <div className="form-group">
                                <label className="form-label">CIC / Admission Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.admissionNumber}
                                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount Paid (₹)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.amountPaid}
                                    onChange={(e) => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    className="form-select"
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="form-row" style={{ marginTop: '12px' }}>
                        <button className="form-btn secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                        <button className="form-btn primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
