"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Check if mobile width (phone)
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Capture install event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener('resize', checkMobile);
        }
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSPrompt(true);
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
            }
            setDeferredPrompt(null);
        }
    };

    // Only show on mobile devices
    if (!isMobile) return null;

    // Logic: Show if we have a prompt (Android) OR if we are on iOS
    // AND must be mobile
    if (!deferredPrompt && !isIOS) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--primary)] bg-[rgba(255,200,0,0.15)] rounded-xl hover:bg-[rgba(255,200,0,0.25)] transition-all mt-4 border border-[var(--primary-dark)] shadow-[var(--glow-primary)]"
            >
                <Download size={18} />
                Install App
            </button>

            {/* iOS Instructions Modal */}
            <AnimatePresence>
                {showIOSPrompt && (
                    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setShowIOSPrompt(false)} />

                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-[var(--bg-panel)] w-full max-w-sm m-4 p-6 rounded-2xl border border-[var(--border-color)] shadow-2xl pointer-events-auto relative"
                        >
                            <h3 className="text-lg font-bold mb-2 text-white">Install on iPhone</h3>
                            <p className="text-[var(--text-secondary)] text-sm mb-4">
                                Install this app on your home screen for a better experience.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-lg">
                                        <Share size={18} className="text-[var(--primary)]" />
                                    </div>
                                    <p className="text-sm text-[var(--text-main)]">1. Tap the <span className="font-bold">Share</span> button below</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-lg">
                                        <div className="text-lg font-bold text-[var(--primary)]">+</div>
                                    </div>
                                    <p className="text-sm text-[var(--text-main)]">2. Select <span className="font-bold">Add to Home Screen</span></p>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-12 h-1 bg-[rgba(255,255,255,0.2)] rounded-full mx-auto" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
