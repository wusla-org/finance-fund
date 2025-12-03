"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Award, Plus, Star, Zap, Heart } from "lucide-react";
import { ContributionModal } from "@/components/contribution-modal";
import { ConfettiCelebration } from "@/components/confetti-celebration";

// Define local types for UI
interface AchievementDef {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface UserData {
    id: string;
    name: string;
    contributions: number;
    visits: number;
    department?: string;
    achievements: { id: string; type: string; unlockedAt: string }[];
}

const DEPARTMENTS = [
    "Computer Science",
    "Engineering",
    "Business",
    "Arts & Design",
    "Medicine",
    "Law",
    "Other"
];

const AVAILABLE_ACHIEVEMENTS: AchievementDef[] = [
    { id: 'first_donation', title: 'First Step', description: 'Made your first contribution', icon: 'Star' },
    { id: 'big_donor', title: 'Big Heart', description: 'Contributed over $500', icon: 'Heart' },
    { id: 'frequent', title: 'Regular', description: 'Visited 3 times', icon: 'Zap' },
];

export function UserProfile() {
    const [user, setUser] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDepartment, setNewDepartment] = useState(DEPARTMENTS[0]);
    const [showAchievement, setShowAchievement] = useState<AchievementDef | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // New State for Modal and Celebration
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/user');
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error("Failed to fetch user", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName || "Anonymous Hero",
                    department: newDepartment
                })
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setIsEditing(false);
            }
        } catch (e) {
            console.error("Failed to create user", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContribute = async (amount: number) => {
        if (!user) return;

        try {
            // Simulate API call with amount (in real app, send amount)
            const res = await fetch('/api/contribute', {
                method: 'POST',
                body: JSON.stringify({ amount }) // Assuming API can handle amount
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);

                // Trigger Celebration
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);

                if (data.newAchievement) {
                    setShowAchievement(data.newAchievement);
                    setTimeout(() => setShowAchievement(null), 4000);
                }
            }
        } catch (e) {
            console.error("Failed to contribute", e);
        }
    };

    // Helper to get achievement details
    const getAchievementDetails = (type: string) => {
        return AVAILABLE_ACHIEVEMENTS.find(a => a.id === type);
    };

    if (isLoading) {
        return (
            <GlassCard className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
            </GlassCard>
        );
    }

    if (!user && !isEditing) {
        return (
            <GlassCard className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold">Join the Cause</h3>
                <p className="text-slate-400 text-sm">Create a profile to track your contributions and earn badges.</p>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full transition-colors"
                >
                    Start My Journey
                </button>
            </GlassCard>
        );
    }

    if (isEditing) {
        return (
            <GlassCard className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Create Profile</h3>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                />

                <div>
                    <label className="text-sm text-slate-400 mb-1 block">Department</label>
                    <div className="grid grid-cols-2 gap-2">
                        {DEPARTMENTS.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setNewDepartment(dept)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${newDepartment === dept
                                    ? 'bg-yellow-500 text-black font-bold'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleCreateUser}
                        className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </GlassCard>
        );
    }

    return (
        <>
            {showConfetti && <ConfettiCelebration />}

            <ContributionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onContribute={handleContribute}
            />

            <div className="space-y-6">
                <GlassCard className="p-6 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-2xl font-bold text-black shadow-lg">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{user?.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs border border-slate-700">
                                        {user?.department || 'General'}
                                    </span>
                                    <span>ID: <span className="font-mono text-xs opacity-50">{user?.id}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400">Total Contributed</div>
                            <div className="text-2xl font-bold text-green-400">${user?.contributions}</div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold flex items-center gap-2">
                                <Award className="text-yellow-500" size={20} /> Achievements
                            </h4>
                            <span className="text-xs text-slate-500">{user?.achievements.length} unlocked</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {user?.achievements.map((ach) => {
                                const details = getAchievementDetails(ach.type);
                                if (!details) return null;
                                return (
                                    <div key={ach.id} className="bg-slate-800/50 p-2 rounded-lg text-center group hover:bg-slate-700/50 transition-colors" title={details.description}>
                                        <div className="w-8 h-8 mx-auto mb-1 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                            {details.icon === 'Star' && <Star size={14} />}
                                            {details.icon === 'Heart' && <Heart size={14} />}
                                            {details.icon === 'Zap' && <Zap size={14} />}
                                        </div>
                                        <div className="text-[10px] truncate">{details.title}</div>
                                    </div>
                                );
                            })}
                            {Array.from({ length: Math.max(0, 3 - (user?.achievements.length || 0)) }).map((_, i) => (
                                <div key={i} className="bg-slate-800/20 p-2 rounded-lg text-center border border-dashed border-slate-700">
                                    <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-slate-800 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-slate-700 rounded-full" />
                                    </div>
                                    <div className="text-[10px] text-slate-600">Locked</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Make a Contribution
                        </button>
                    </div>
                </GlassCard>

                <AnimatePresence>
                    {showAchievement && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="fixed bottom-8 right-8 z-[60]"
                        >
                            <GlassCard className="p-4 flex items-center gap-4 border-yellow-500/50 shadow-yellow-900/20 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
                                <div className="p-3 bg-yellow-500 rounded-full text-black animate-bounce">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Achievement Unlocked!</div>
                                    <div className="font-bold text-lg">{showAchievement.title}</div>
                                    <div className="text-sm text-slate-400">{showAchievement.description}</div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
