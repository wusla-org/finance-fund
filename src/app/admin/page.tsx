import { prisma } from "@/lib/db";
import { DataEntryForm } from "@/components/admin/data-entry-form";

export const dynamic = "force-dynamic";

async function getDepartments() {
    return await prisma.department.findMany({
        orderBy: { name: "asc" },
    });
}

export default async function AdminPage() {
    const departments = await getDepartments();

    return (
        <main className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold text-white mb-8 text-center">Admin Dashboard</h1>
                <DataEntryForm departments={departments} />
            </div>
        </main>
    );
}
