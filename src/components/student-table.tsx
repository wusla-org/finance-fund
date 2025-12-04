"use client";

import { useState } from "react";
import { Search, Filter, Trash2, CheckSquare, Square, MoreHorizontal, X, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface StudentTableProps {
    students?: Student[]; // Make optional to avoid build errors if parent doesn't pass it yet
}

export function StudentTable({ students = [] }: StudentTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "ALL" || student.status === filter;
        return matchesSearch && matchesFilter;
    });

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredStudents.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredStudents.map(s => s.id)));
        }
    };

    const handleDelete = async (deleteAll: boolean = false) => {
        if (!deleteAll && selectedIds.size === 0) return;

        setIsDeleting(true);
        try {
            const res = await fetch("/api/admin/student", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ids: deleteAll ? [] : Array.from(selectedIds),
                    deleteAll
                }),
            });

            if (res.ok) {
                setSelectedIds(new Set());
                setIsSelectionMode(false);
                setShowDeleteConfirm(false);
                router.refresh();
            } else {
                alert("Failed to delete students");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="col-span-12 lg:col-span-4">
            <div className="content-panel h-full relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isSelectionMode ? `${selectedIds.size} Selected` : "Recent Activity"}
                    </h2>
                    <div className="flex gap-2">
                        {isSelectionMode ? (
                            <>
                                <button
                                    onClick={() => handleDelete(false)}
                                    disabled={selectedIds.size === 0 || isDeleting}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        setIsSelectionMode(false);
                                        setSelectedIds(new Set());
                                    }}
                                    className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search - Minimalist */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                    />
                </div>

                {isSelectionMode && (
                    <div className="flex justify-between items-center mb-4 px-2">
                        <button
                            onClick={toggleSelectAll}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            {selectedIds.size === filteredStudents.length ? <CheckSquare size={14} /> : <Square size={14} />}
                            Select All
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                            <ShieldAlert size={14} />
                            Delete All Data
                        </button>
                    </div>
                )}

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => isSelectionMode && toggleSelection(student.id)}
                                className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group
                                    ${isSelectionMode && selectedIds.has(student.id) ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {isSelectionMode && (
                                        <div className={`text-blue-500 transition-all ${selectedIds.has(student.id) ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
                                            {selectedIds.has(student.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </div>
                                    )}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm
                                        ${student.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                                            student.status === 'PARTIAL' ? 'bg-amber-100 text-amber-600' :
                                                'bg-gray-100 text-gray-500'}`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{student.name}</h4>
                                        <p className="text-gray-400 text-xs">{student.department.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-800 text-sm">
                                        +₹{student.amountPaid.toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider
                                        ${student.status === 'COMPLETED' ? 'text-emerald-500' :
                                            student.status === 'PARTIAL' ? 'text-amber-500' :
                                                'text-gray-400'}`}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            No recent activity found.
                        </div>
                    )}
                </div>

                {!isSelectionMode && (
                    <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                        View All Transactions
                    </button>
                )}

                {/* Delete All Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
                        <div className="bg-white border border-red-100 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <ShieldAlert size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Delete All Data?</h4>
                            <p className="text-gray-500 text-sm mb-6">
                                This action cannot be undone. This will permanently delete ALL student records and contributions.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(true)}
                                    disabled={isDeleting}
                                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete All"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
