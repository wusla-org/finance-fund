import { prisma } from "@/lib/db";
import { HeroStats } from "@/components/hero-stats";
import { DepartmentList } from "@/components/department-list";
import { StudentTable } from "@/components/student-table";

export const dynamic = "force-dynamic";

async function getStats() {
  const totalCollected = await prisma.student.aggregate({
    _sum: { amountPaid: true },
  });

  const totalTarget = await prisma.student.aggregate({
    _sum: { target: true },
  });

  return {
    collected: totalCollected._sum.amountPaid || 0,
    goal: totalTarget._sum.target || 0,
  };
}

async function getDepartments() {
  const departments = await prisma.department.findMany({
    include: {
      students: true,
    },
  });

  return departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    totalCollected: dept.students.reduce((acc, s) => acc + s.amountPaid, 0),
    target: dept.students.reduce((acc, s) => acc + s.target, 0),
    studentCount: dept.students.length,
  }));
}

async function getStudents() {
  const students = await prisma.student.findMany({
    include: {
      department: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 10, // Limit to recent 10
  });
  return students;
}

async function getTopStudents() {
  // Group by name and department to aggregate duplicates
  const groupedStudents = await prisma.student.groupBy({
    by: ['name', 'departmentId'],
    _sum: {
      amountPaid: true,
    },
    orderBy: {
      _sum: {
        amountPaid: 'desc',
      },
    },
    take: 5,
  });

  // Fetch department names
  const departmentIds = groupedStudents.map(s => s.departmentId).filter((id): id is string => id !== null);
  const departments = await prisma.department.findMany({
    where: {
      id: { in: departmentIds },
    },
  });

  const deptMap = new Map(departments.map(d => [d.id, d.name]));

  return groupedStudents.map((s, index) => ({
    id: `${s.name}-${s.departmentId}-${index}`, // Unique key for UI
    name: s.name,
    amount: s._sum.amountPaid || 0,
    department: deptMap.get(s.departmentId) || 'Unknown',
  }));
}

async function getDailyStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const contributions = await prisma.contribution.groupBy({
    by: ['createdAt'],
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  // Process data to group by day
  const dailyMap = new Map<string, number>();
  contributions.forEach(c => {
    const day = c.createdAt.toISOString().split('T')[0];
    dailyMap.set(day, (dailyMap.get(day) || 0) + (c._sum.amount || 0));
  });

  // Generate last 7 days array
  const result = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      day: days[d.getDay()],
      amount: dailyMap.get(dateStr) || 0,
    });
  }

  return result;
}

export default async function Home() {
  const stats = await getStats();
  const departments = await getDepartments();
  const students = await getStudents();
  const topStudents = await getTopStudents();
  const dailyStats = await getDailyStats();

  const { collected: totalCollected, goal } = stats;

  return (
    <main className="min-h-screen pb-12">
      <div className="dashboard-grid">
        <HeroStats
          totalCollected={totalCollected}
          goal={1000000}
          topStudents={topStudents}
          dailyStats={dailyStats}
        />
        <DepartmentList departments={departments} />
        <StudentTable students={students} />
      </div>
    </main>
  );
}
