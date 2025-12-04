import { prisma } from "@/lib/db";
import { DataEntryForm } from "@/components/admin/data-entry-form";
import { DepartmentForm } from "@/components/admin/department-form";

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
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-4xl font-serif font-bold text-white mb-2 text-center">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400 text-center mb-12">
                    Manage departments and student records
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Department Form - 1 column */}
                    <div className="lg:col-span-1">
                        <DepartmentForm />
                    </div>

                    {/* Student Form - 2 columns */}
                    <div className="lg:col-span-2">
                        <DataEntryForm departments={departments} />
                    </div>
                </div>
            </div>
        </main>
    );
}
