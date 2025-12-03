"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";

interface Department {
    id: string;
    name: string;
}

interface DataEntryFormProps {
    departments: Department[];
}

export function DataEntryForm({ departments }: DataEntryFormProps) {
    const [name, setName] = useState("");
    const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
    const [amountPaid, setAmountPaid] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    departmentId,
                    amountPaid: Number(amountPaid),
                }),
            });

            if (res.ok) {
                setMessage("Student added successfully!");
                setName("");
                setAmountPaid("");
            } else {
                setMessage("Failed to add student.");
            }
        } catch (error) {
            setMessage("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bento-card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Plus size={20} className="text-emerald-400" /> Add Student Record
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-emerald-200/70 mb-2">Student Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-emerald-900/30 border border-emerald-500/20 rounded-xl text-emerald-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-emerald-700"
                        placeholder="John Doe"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-emerald-200/70 mb-2">Department</label>
                        <div className="relative">
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="w-full px-4 py-3 bg-emerald-900/30 border border-emerald-500/20 rounded-xl text-emerald-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                            >
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id} className="bg-emerald-950 text-emerald-100">
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-emerald-200/70 mb-2">Amount Paid (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="w-full px-4 py-3 bg-emerald-900/30 border border-emerald-500/20 rounded-xl text-emerald-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-emerald-700"
                            placeholder="0"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? "Saving..." : <><Save size={18} /> Save Record</>}
                </button>

                {message && (
                    <div className={`p-4 rounded-xl text-sm text-center font-medium ${message.includes("success") ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
