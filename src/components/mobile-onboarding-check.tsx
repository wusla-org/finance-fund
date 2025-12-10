"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function MobileOnboardingCheck() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip check if already on onboarding page or specific safe routes
        if (pathname === '/onboarding' || pathname.startsWith('/api')) return;

        const hasSeen = localStorage.getItem('hasSeenOnboarding');
        const isMobile = window.innerWidth < 768; // Standard mobile breakpoint

        if (isMobile && !hasSeen) {
            router.push('/onboarding');
        }
    }, [pathname, router]);

    return null;
}
