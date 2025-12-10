"use client";

import { useTheme } from "@/components/theme-provider";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="theme-toggle-skeleton" />;

    const icons = {
        light: <Sun size={18} />,
        dark: <Moon size={18} />,
        system: <Monitor size={18} />,
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="theme-toggle-container">
            <button
                className={`theme-btn ${isOpen ? 'active' : ''}`}
                onClick={toggleOpen}
                aria-label="Toggle theme"
            >
                {icons[theme]}
                <span className="theme-label">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="theme-dropdown"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {(Object.keys(icons) as Array<keyof typeof icons>).map((t) => (
                            <button
                                key={t}
                                className={`theme-option ${theme === t ? 'selected' : ''}`}
                                onClick={() => {
                                    setTheme(t);
                                    setIsOpen(false);
                                }}
                            >
                                {icons[t]}
                                <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
