import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // 1. Total Collected & Goal
        const totalCollectedAgg = await prisma.student.aggregate({
            _sum: { amountPaid: true },
        });
        const totalCollected = totalCollectedAgg._sum.amountPaid || 0;
        const goal = 1000000; // Fixed goal for now

        // 2. Top Students
        const groupedStudents = await prisma.student.groupBy({
            by: ['name', 'departmentId'],
            _sum: { amountPaid: true },
            orderBy: { _sum: { amountPaid: 'desc' } },
            take: 5,
        });

        const departmentIds = groupedStudents
            .map(s => s.departmentId)
            .filter((id): id is string => id !== null);

        const departments = await prisma.department.findMany({
            where: { id: { in: departmentIds } },
        });

        const deptMap = new Map(departments.map(d => [d.id, d.name]));

        const topStudents = groupedStudents.map((s, index) => ({
            id: `${s.name}-${s.departmentId}-${index}`,
            name: s.name,
            amount: s._sum.amountPaid || 0,
            department: deptMap.get(s.departmentId) || 'Unknown',
        }));

        // 3. Daily Stats (Growth Trends)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const contributions = await prisma.contribution.groupBy({
            by: ['createdAt'],
            _sum: { amount: true },
            where: { createdAt: { gte: sevenDaysAgo } },
        });

        const dailyMap = new Map<string, number>();
        contributions.forEach(c => {
            const day = c.createdAt.toISOString().split('T')[0];
            dailyMap.set(day, (dailyMap.get(day) || 0) + (c._sum.amount || 0));
        });

        const dailyStats = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyStats.push({
                day: days[d.getDay()],
                amount: dailyMap.get(dateStr) || 0,
                date: dateStr // useful for unique keys
            });
        }

        return NextResponse.json({
            totalCollected,
            goal,
            topStudents,
            dailyStats
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
