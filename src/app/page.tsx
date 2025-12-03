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

export default async function Home() {
  const stats = await getStats();
  const departments = await getDepartments();
  const students = await getStudents();

  const { collected: totalCollected, goal } = stats;

  return (
    <main className="min-h-screen pb-12">
      <div className="dashboard-grid">
        <HeroStats totalCollected={totalCollected} goal={goal} />
        <DepartmentList departments={departments} />
        <StudentTable students={students} />
      </div>
    </main>
  );
}
