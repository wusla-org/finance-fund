"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("ALL");

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "ALL" || student.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="col-span-12 lg:col-span-4">
            <div className="content-panel h-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                    <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <Filter size={18} />
                    </button>
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

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
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

                <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    View All Transactions
                </button>
            </div>
        </div>
    );
}
