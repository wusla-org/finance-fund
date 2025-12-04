"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";

export function DepartmentForm() {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/department", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Department added successfully!");
                setName("");
                // Refresh the page after 1 second to show new data
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setMessage(`❌ Error: ${data.error || "Failed to add department"}`);
                console.error("API Error:", data);
            }
        } catch (error) {
            setMessage(`❌ Network error: ${error instanceof Error ? error.message : "An error occurred"}`);
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bento-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Building2 size={20} className="text-blue-400" /> Add Department
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-blue-200/70 mb-2">
                        Department Name
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/20 rounded-xl text-blue-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-blue-700"
                        placeholder="e.g., Computer Science"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Adding..." : (
                        <>
                            <Plus size={18} /> Add Department
                        </>
                    )}
                </button>

                {message && (
                    <div
                        className={`p-4 rounded-xl text-sm text-center font-medium ${
                            message.includes("✅")
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : "bg-red-500/10 text-red-300 border border-red-500/20"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
