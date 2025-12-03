import { NextResponse } from 'next/server';
import { db, User } from '@/lib/db';

export async function GET() {
    const users = db.getAllUsers();

    // Group by department
    const departments: Record<string, { total: number, count: number, topDonors: User[] }> = {};

    users.forEach(user => {
        if (!user.department) return;

        if (!departments[user.department]) {
            departments[user.department] = { total: 0, count: 0, topDonors: [] };
        }

        departments[user.department].total += user.contributions;
        departments[user.department].count += 1;
        departments[user.department].topDonors.push(user);
    });

    // Sort donors and departments
    const leaderboard = Object.entries(departments).map(([name, stats]) => {
        stats.topDonors.sort((a, b) => b.contributions - a.contributions);
        return {
            name,
            total: stats.total,
            count: stats.count,
            topDonors: stats.topDonors.slice(0, 5) // Top 5 per department
        };
    }).sort((a, b) => b.total - a.total);

    return NextResponse.json(leaderboard);
}
