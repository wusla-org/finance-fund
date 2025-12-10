"use client";

import { HeroAnimation } from "@/components/onboarding/hero-animation";
import { FeatureCarousel } from "@/components/onboarding/feature-carousel";
import { useRouter } from "next/navigation";
import { InstallPrompt } from "@/components/ui/install-prompt";

export default function OnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-yellow-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[100px] rounded-full" />
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-10">
                <div className="text-center mb-10 space-y-4">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-2">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Finance Fund</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        The modern way to manage student contributions and transparent treasury.
                    </p>
                </div>

                <HeroAnimation />

                <FeatureCarousel onComplete={handleComplete} />

                <div className="w-full max-w-sm px-6 mb-4">
                    <InstallPrompt />
                </div>

                <footer className="w-full text-center py-6 text-gray-600 text-sm">
                    © 2024 WUSLA Finance Team
                </footer>
            </main>
        </div>
    );
}
