import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/sidebar";
import { DeveloperContent } from "@/components/developer/developer-content";
import { checkAuth } from "@/lib/auth";
import { LoginPage } from "@/components/auth/login-page";

export const dynamic = "force-dynamic";

async function getAllStudents() {
    return await prisma.student.findMany({
        include: {
            department: { select: { name: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });
}

async function getAllDepartments() {
    return await prisma.department.findMany({
        include: {
            _count: { select: { students: true } }
        },
        orderBy: { name: 'asc' }
    });
}

async function getStats() {
    const totalStudents = await prisma.student.count();
    const totalDepts = await prisma.department.count();
    const totalCollected = await prisma.student.aggregate({ _sum: { amountPaid: true } });
    const totalContributions = await prisma.contribution.count();

    return {
        totalStudents,
        totalDepts,
        totalCollected: totalCollected._sum.amountPaid || 0,
        totalContributions
    };
}

export default async function DeveloperPage() {
    // Check if user is authenticated
    const isAuthenticated = await checkAuth("developer");

    if (!isAuthenticated) {
        return <LoginPage type="developer" title="Developer Login" redirectTo="/developer" />;
    }

    const students = await getAllStudents();
    const departments = await getAllDepartments();
    const stats = await getStats();

    return (
        <div className="app-wrapper">
            <div className="app-container" style={{ gridTemplateColumns: '260px 1fr' }}>
                <Sidebar />
                <DeveloperContent
                    students={students}
                    departments={departments}
                    stats={stats}
                />
            </div>
        </div>
    );
}
