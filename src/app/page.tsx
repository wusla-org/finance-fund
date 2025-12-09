import { prisma } from "@/lib/db";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  // 1. Stats (Hero)
  const totalCollectedAgg = await prisma.student.aggregate({ _sum: { amountPaid: true } });

  const totalCollected = totalCollectedAgg._sum.amountPaid || 0;
  const goal = 1500000; // Fixed goal: ₹15,00,000 (15 lakh)

  // 2. Top Students (only those who have contributed)
  const groupedStudents = await prisma.student.groupBy({
    by: ['name', 'departmentId'],
    _sum: { amountPaid: true },
    where: { amountPaid: { gt: 0 } }, // Only students who have paid
    orderBy: { _sum: { amountPaid: 'desc' } },
    take: 5,
  });

  const departmentIds = groupedStudents.map(s => s.departmentId).filter((id): id is string => id !== null);
  const deptNames = await prisma.department.findMany({
    where: { id: { in: departmentIds } },
    select: { id: true, name: true }
  });
  const deptMap = new Map(deptNames.map(d => [d.id, d.name]));

  const topStudents = groupedStudents
    .filter(s => (s._sum.amountPaid || 0) > 0) // Double check: only with contributions
    .map((s, index) => ({
      id: `${s.name}-${s.departmentId}-${index}`,
      name: s.name,
      amount: s._sum.amountPaid || 0,
      department: deptMap.get(s.departmentId) || 'Unknown',
    }));

  // 3. Daily Stats
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const contributions = await prisma.contribution.groupBy({
    by: ['createdAt'],
    _sum: { amount: true },
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  const dailyMap = new Map<string, number>();
  contributions.forEach((c: { createdAt: Date; _sum: { amount: number | null } }) => {
    const day = c.createdAt.toISOString().split('T')[0];
    dailyMap.set(day, (dailyMap.get(day) || 0) + (c._sum.amount || 0));
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyStats = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dailyStats.push({
      day: days[d.getDay()],
      amount: dailyMap.get(dateStr) || 0,
    });
  }

  // 4. Departments
  const departmentsData = await prisma.department.findMany({
    include: {
      students: {
        select: { amountPaid: true } // Only select needed fields to avoid DB crash
      }
    },
    orderBy: { name: 'asc' }
  });

  const departments = departmentsData.map((dept) => {
    const studentCount = dept.students.length;
    const target = studentCount * 5000;
    const collected = dept.students.reduce((acc: number, s: any) => acc + s.amountPaid, 0);

    return {
      id: dept.id,
      name: dept.name,
      totalCollected: collected,
      target: target > 0 ? target : 5000,
      studentCount: studentCount,
    };
  });

  // 5. Top Contributors
  const topContributors = await prisma.student.findMany({
    select: {
      id: true,
      name: true,
      amountPaid: true,
      target: true, // Needed for types
      status: true, // Needed for types
      // admissionNumber: false, // Don't select
      department: { select: { name: true } }
    },
    orderBy: { amountPaid: 'desc' },
    take: 10,
  });

  return {
    stats: { totalCollected, goal, topStudents, dailyStats },
    departments,
    students: topContributors
  };
}

export default async function Home() {
  const initialData = await getDashboardData();

  return <DashboardView initialData={initialData} />;
}
