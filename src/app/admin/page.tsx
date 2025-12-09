import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/sidebar";
import { AdminContent } from "@/components/admin/admin-content";
import { checkAuth } from "@/lib/auth";
import { LoginPage } from "@/components/auth/login-page";

export const dynamic = "force-dynamic";

async function getDepartments() {
    try {
        return await prisma.department.findMany({
            include: {
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: "asc" },
        });
    } catch (e) {
        console.error("DB Error (getDepartments):", e);
        // Return mock departments so Admin UI can render
        return [
            { id: 'mock-1', name: 'Computer Science (Offline Mode)', _count: { students: 0 } },
            { id: 'mock-2', name: 'BBA (Offline Mode)', _count: { students: 0 } }
        ];
    }
}

async function getRecentStudents() {
    try {
        return await prisma.student.findMany({
            select: {
                id: true,
                name: true,
                amountPaid: true,
                status: true,
                updatedAt: true,
                departmentId: true,
                admissionNumber: true,
                department: { select: { name: true } }
            },
            orderBy: { updatedAt: 'desc' },
        });
    } catch (e) {
        console.error("DB Error (getRecentStudents):", e);
        return []; // Return empty on error to keep UI alive
    }
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
