"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";

interface Department {
    id: string;
    name: string;
}

interface DataEntryFormProps {
    departments: Department[];
}

export function DataEntryForm({ departments }: DataEntryFormProps) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
    const [amountPaid, setAmountPaid] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);

    // Check if departments exist
    if (!departments || departments.length === 0) {
        return (
            <div className="bento-card p-8">
                <div className="text-center text-yellow-400 p-8">
                    <h3 className="text-xl font-bold mb-4">No Departments Yet</h3>
                    <p className="text-slate-400">Please create a department first using the form on the left.</p>
                </div>
            </div>
        );
    }

    const submitData = async (force = false) => {
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
                    force
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.requiresConfirmation) {
                    setPendingData(data);
                    setShowConfirm(true);
                    setIsLoading(false);
                    return;
                }

                setMessage("✅ Student added successfully!");
                setName("");
                setAmountPaid("");
                setShowConfirm(false);
                setPendingData(null);
                // Refresh the page immediately to show new data
                router.refresh();
            } else {
                setMessage(`❌ Error: ${data.error || "Failed to add student"}`);
                console.error("API Error:", data);
            }
        } catch (error) {
            setMessage(`❌ Network error: ${error instanceof Error ? error.message : "An error occurred"}`);
            console.error("Fetch error:", error);
        } finally {
            if (!showConfirm) setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitData(false);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        await submitData(true);
    };

    return (
        <div className="bento-card p-8 max-w-2xl mx-auto relative">
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

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                        <h4 className="text-lg font-bold text-white mb-2">Duplicate Student Found</h4>
                        <p className="text-gray-300 text-sm mb-6">
                            {pendingData?.message || "This student already exists."}
                            <br />
                            Do you want to add this contribution to the existing student?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Confirm & Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
