"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LoginPageProps {
    type: "admin" | "developer";
    title: string;
    redirectTo: string;
}

export function LoginPage({ type, title, redirectTo }: LoginPageProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, type }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(redirectTo);
                router.refresh();
            } else {
                setError(data.error || "Invalid password");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link href="/" className="login-back">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="login-card">
                    <div className="login-icon">
                        <Lock size={28} />
                    </div>

                    <h1 className="login-title">{title}</h1>
                    <p className="login-subtitle">Enter password to continue</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="login-input"
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                className="login-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Login"}
                        </button>
                    </form>
                </div>

                <p className="login-hint">
                    {type === "admin" ? "Admin access required" : "Developer access required"}
                </p>
            </motion.div>
        </main>
    );
}
