import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, departmentId, amountPaid, force } = body;

        // Validation
        if (!name || !departmentId || amountPaid === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: name, departmentId, or amountPaid" },
                { status: 400 }
            );
        }

        // Fetch all students in the department to do a robust JS-based fuzzy check
        // (Avoids Prisma case-sensitivity quirks/types for now)
        const deptStudents = await prisma.student.findMany({
            where: { departmentId },
            select: { id: true, name: true, amountPaid: true }
        });

        const normalizedInputName = name.trim().toLowerCase();
        const existingStudent = deptStudents.find(s =>
            s.name.trim().toLowerCase() === normalizedInputName
        );

        let student;

        if (existingStudent) {
            // If duplicate found and not forced, ask for confirmation
            if (!force) {
                return NextResponse.json({
                    requiresConfirmation: true,
                    message: `Student "${existingStudent.name}" already exists in this department.`,
                    existingStudent
                });
            }

            // Update existing
            const newAmount = existingStudent.amountPaid + amountPaid;
            const newStatus = newAmount >= 5000 ? "COMPLETED" : newAmount > 0 ? "PARTIAL" : "PENDING";

            student = await prisma.student.update({
                where: { id: existingStudent.id },
                data: {
                    amountPaid: newAmount,
                    status: newStatus,
                }
            });

            await prisma.contribution.create({
                data: {
                    amount: amountPaid,
                    studentId: student.id
                }
            });
        } else {
            // Create new
            const status = amountPaid >= 5000 ? "COMPLETED" : amountPaid > 0 ? "PARTIAL" : "PENDING";
            student = await prisma.student.create({
                data: {
                    name: name.trim(), // Store trimmed name
                    departmentId,
                    amountPaid,
                    status,
                    target: 5000,
                },
            });

            await prisma.contribution.create({
                data: {
                    amount: amountPaid,
                    studentId: student.id
                }
            });
        }

        return NextResponse.json(student);
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { error: "Failed to create student", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { ids, deleteAll } = body;

        if (deleteAll) {
            // Delete all students
            // Due to foreign key constraints, we might need to delete contributions first if cascade isn't set up in DB
            await prisma.contribution.deleteMany({});
            await prisma.student.deleteMany({});
            return NextResponse.json({ message: "All students deleted successfully" });
        }

        if (ids && Array.isArray(ids) && ids.length > 0) {
            // Delete specific students
            await prisma.contribution.deleteMany({
                where: { studentId: { in: ids } }
            });
            await prisma.student.deleteMany({
                where: { id: { in: ids } }
            });
            return NextResponse.json({ message: `${ids.length} students deleted successfully` });
        }

        return NextResponse.json({ error: "Invalid request. Provide 'ids' array or 'deleteAll': true" }, { status: 400 });

    } catch (error) {
        console.error("Error deleting students:", error);
        return NextResponse.json(
            { error: "Failed to delete students", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
