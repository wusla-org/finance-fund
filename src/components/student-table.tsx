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
    students?: Student[];
    className?: string;
    allowDelete?: boolean;
}

export function StudentTable({ students = [], className, allowDelete = false }: StudentTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [visibleCount, setVisibleCount] = useState(5);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "ALL" || student.status === filter;
        return matchesSearch && matchesFilter;
    });

    const displayedStudents = filteredStudents.slice(0, visibleCount);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

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
        <div className={className || "col-span-12 lg:col-span-4"}>
            <div className="h-full relative bg-transparent border-none shadow-none p-0">
                {/* ... (Header and Search remain the same) ... */}
                <div className="flex items-center justify-between mb-6 px-4 pt-2">
                    <h2 className="text-xl font-bold text-white">
                        {isSelectionMode ? `${selectedIds.size} Selected` : "Top Contributors"}
                    </h2>
                    <div className="flex gap-2">
                        {allowDelete && (
                            isSelectionMode ? (
                                <>
                                    <button
                                        onClick={() => handleDelete(false)}
                                        disabled={selectedIds.size === 0 || isDeleting}
                                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsSelectionMode(false);
                                            setSelectedIds(new Set());
                                        }}
                                        className="text-zinc-400 hover:bg-zinc-800 p-2 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsSelectionMode(true)}
                                    className="text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-colors"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Search - Solid Dark */}
                <div className="relative mb-6 px-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all placeholder:text-zinc-600"
                    />
                </div>

                {isSelectionMode && (
                    <div className="flex justify-between items-center mb-4 px-4">
                        <button
                            onClick={toggleSelectAll}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            {selectedIds.size === filteredStudents.length ? <CheckSquare size={14} /> : <Square size={14} />}
                            Select All
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                            <ShieldAlert size={14} />
                            Delete All Data
                        </button>
                    </div>
                )}

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar px-2">
                    {displayedStudents.length > 0 ? (
                        displayedStudents.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => isSelectionMode && toggleSelection(student.id)}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group border border-transparent
                                    ${isSelectionMode && selectedIds.has(student.id) ? 'bg-blue-500/10 border-blue-500/30' : 'hover:bg-zinc-800 hover:border-zinc-700'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {isSelectionMode && (
                                        <div className={`text-blue-400 transition-all ${selectedIds.has(student.id) ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
                                            {selectedIds.has(student.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </div>
                                    )}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-zinc-800 shadow-sm
                                        ${student.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            student.status === 'PARTIAL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-200 text-sm group-hover:text-white transition-colors">{student.name}</h4>
                                        <p className="text-zinc-500 text-xs group-hover:text-zinc-400 transition-colors">{student.department.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-zinc-200 text-sm tabular-nums">
                                        +₹{student.amountPaid.toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider
                                        ${student.status === 'COMPLETED' ? 'text-emerald-500' :
                                            student.status === 'PARTIAL' ? 'text-amber-500' :
                                                'text-zinc-600'}`}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-zinc-600 text-sm">
                            No contributors found yet.
                        </div>
                    )}
                </div>

                {!isSelectionMode && visibleCount < filteredStudents.length && (
                    <div className="px-2">
                        <button
                            onClick={handleShowMore}
                            className="w-full mt-6 py-3 text-sm font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 hover:text-white transition-all"
                        >
                            Show More ({filteredStudents.length - visibleCount} remaining)
                        </button>
                    </div>
                )}

                {/* Delete All Confirmation Modal - Dark Mode */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
                        <div className="bg-zinc-900 border border-red-500/20 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <ShieldAlert size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Delete All Data?</h4>
                            <p className="text-zinc-400 text-sm mb-6">
                                This action cannot be undone. This will permanently delete ALL student records and contributions.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-bold transition-colors"
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
