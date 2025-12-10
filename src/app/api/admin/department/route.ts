import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        // Validation
        if (!name || name.trim() === "") {
            return NextResponse.json(
                { error: "Department name is required" },
                { status: 400 }
            );
        }

        // Check if department already exists
        const existing = await prisma.department.findUnique({
            where: { name: name.trim() },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Department already exists" },
                { status: 409 }
            );
        }

        const department = await prisma.department.create({
            data: {
                name: name.trim(),
            },
        });

        return NextResponse.json(department);
    } catch (error) {
        console.error("Error creating department:", error);
        return NextResponse.json(
            { error: "Failed to create department", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name } = body;

        if (!id || !name) {
            return NextResponse.json({ error: "ID and Name are required" }, { status: 400 });
        }

        const existing = await prisma.department.findUnique({
            where: { name: name.trim() }
        });

        if (existing && existing.id !== id) {
            return NextResponse.json(
                { error: "Department name already exists" },
                { status: 409 }
            );
        }

        const updated = await prisma.department.update({
            where: { id },
            data: { name: name.trim() }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating department:", error);
        return NextResponse.json(
            { error: "Failed to update department", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
        }

        // Check if department has students
        const deptWithStudents = await prisma.department.findUnique({
            where: { id },
            include: { _count: { select: { students: true } } }
        });

        if (!deptWithStudents) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 });
        }

        // Optional: Block deletion if students exist, or allow cascade (Prisma schema handles cascade if configured, but usually good to warn)
        // For developer console, we might want to allow force delete or just delete.
        // Let's assume we delete everything related to it if we proceed.

        // Delete students first if not cascading in DB (though we added cascade to contributions, student->dept relation usually restricts)
        // If we want to delete department, we must delete students first.

        await prisma.contribution.deleteMany({
            where: { student: { departmentId: id } }
        });

        await prisma.student.deleteMany({
            where: { departmentId: id }
        });

        await prisma.department.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error("Error deleting department:", error);
        return NextResponse.json(
            { error: "Failed to delete department", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
