import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/sidebar";
import { AdminContent } from "@/components/admin/admin-content";
import { checkAuth } from "@/lib/auth";
import { LoginPage } from "@/components/auth/login-page";

export const dynamic = "force-dynamic";

async function getDepartments() {
    return await prisma.department.findMany({
        include: {
            _count: {
                select: { students: true }
            }
        },
        orderBy: { name: "asc" },
    });
}

async function getRecentStudents() {
    return await prisma.student.findMany({
        include: { department: { select: { name: true } } },
        orderBy: { updatedAt: 'desc' },
    });
}

export default async function AdminPage() {
    // Check if user is authenticated
    const isAuthenticated = await checkAuth("admin");

    if (!isAuthenticated) {
        return <LoginPage type="admin" title="Admin Login" redirectTo="/admin" />;
    }

    const departments = await getDepartments();
    const recentStudents = await getRecentStudents();

    return (
        <div className="app-wrapper">
            <div className="app-container" style={{ gridTemplateColumns: '260px 1fr' }}>
                <Sidebar />
                <AdminContent
                    departments={departments}
                    recentStudents={recentStudents}
                />
            </div>
        </div>
    );
}
