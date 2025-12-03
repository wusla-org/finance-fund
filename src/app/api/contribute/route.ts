import { NextResponse, NextRequest } from 'next/server';
import { db, Achievement } from '@/lib/db';

const AVAILABLE_ACHIEVEMENTS = [
    { id: 'first_donation', title: 'First Step', description: 'Made your first contribution', icon: 'Star' },
    { id: 'big_donor', title: 'Big Heart', description: 'Contributed over $500', icon: 'Heart' },
    { id: 'frequent', title: 'Regular', description: 'Visited 3 times', icon: 'Zap' },
];

export async function POST(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = db.getUser(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Simulate secure payment processing
    // In real app: Validate Stripe webhook or session
    const amount = Math.floor(Math.random() * 100) + 10; // Server decides amount for demo

    const newContributions = user.contributions + amount;
    const newAchievements = [...user.achievements];
    let newUnlock: Achievement | null = null;

    // Check 'First Step'
    if (!newAchievements.find(a => a.type === 'first_donation')) {
        const ach: Achievement = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'first_donation',
            unlockedAt: new Date().toISOString()
        };
        newAchievements.push(ach);
        newUnlock = ach;
    }

    // Check 'Big Heart'
    if (newContributions > 500 && !newAchievements.find(a => a.type === 'big_donor')) {
        const ach: Achievement = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'big_donor',
            unlockedAt: new Date().toISOString()
        };
        newAchievements.push(ach);
        newUnlock = ach; // Overwrite or handle multiple? Just show latest for now.
    }

    const updatedUser = db.updateUser(userId, {
        contributions: newContributions,
        achievements: newAchievements
    });

    return NextResponse.json({
        user: updatedUser,
        addedAmount: amount,
        newAchievement: newUnlock ? {
            ...newUnlock,
            ...AVAILABLE_ACHIEVEMENTS.find(a => a.id === newUnlock!.type)
        } : null
    });
}
