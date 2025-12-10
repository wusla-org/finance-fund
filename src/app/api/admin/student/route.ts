import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, admissionNumber, departmentId, amountPaid, force, action } = body; // action: 'create' | 'update' | undefined

        // Validation
        if (!name || !departmentId || amountPaid === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: name, departmentId, or amountPaid" },
                { status: 400 }
            );
        }

        const normalizedInputName = name.trim().toLowerCase();
        let existingStudent = null;
        let matchType = null; // 'ID' | 'NAME'

        // 1. Check by Admission Number
        if (admissionNumber) {
            existingStudent = await prisma.student.findUnique({
                where: { admissionNumber: admissionNumber.trim() }
            });
            if (existingStudent) matchType = 'ID';
        }

        // 2. Check by Fuzzy Name (Weak Match) if not found by ID
        if (!existingStudent) {
            // Fetch all students in the department
            const deptStudents = await prisma.student.findMany({
                where: { departmentId },
                select: { id: true, name: true, amountPaid: true, admissionNumber: true }
            });

            existingStudent = deptStudents.find(s =>
                s.name.trim().toLowerCase() === normalizedInputName
            ) || null;
            if (existingStudent) matchType = 'NAME';
        }

        // Handle Existing Student Found
        if (existingStudent) {
            // If action is explicitly 'create':
            if (action === 'create') {
                // If ID match, we cannot create a new student with same ID (Unique Constraint)
                if (matchType === 'ID') {
                    return NextResponse.json(
                        { error: `Student with Admission Number "${admissionNumber}" already exists.` },
                        { status: 400 }
                    );
                }
                // If Name match, continue (allow duplicate names if IDs are different or not provided)
            }
            // If action is 'update' or no action (check)
            else {
                if (action === 'update' || force) {
                    const newAmount = existingStudent.amountPaid + amountPaid;
                    const newStatus = newAmount >= 5000 ? "COMPLETED" : newAmount > 0 ? "PARTIAL" : "PENDING";

                    const updatedStudent = await prisma.student.update({
                        where: { id: existingStudent.id },
                        data: {
                            amountPaid: newAmount,
                            status: newStatus,
                            // Ensure admission number is updated if provided and missing
                            ...(admissionNumber && !existingStudent.admissionNumber ? { admissionNumber: admissionNumber.trim() } : {})
                        },
                        select: {
                            id: true,
                            name: true,
                            departmentId: true,
                            amountPaid: true,
                            status: true,
                            target: true,
                            createdAt: true,
                            updatedAt: true,
                            admissionNumber: true
                        }
                    });

                    await prisma.contribution.create({
                        data: {
                            amount: amountPaid,
                            studentId: updatedStudent.id
                        }
                    });

                    return NextResponse.json(updatedStudent);
                }

                return NextResponse.json({
                    requiresConfirmation: true,
                    message: `Student "${existingStudent.name}" already exists in this department.`,
                    existingStudent
                });
            }
        }

        // Create New Student
        const status = amountPaid >= 5000 ? "COMPLETED" : amountPaid > 0 ? "PARTIAL" : "PENDING";

        try {
            const newStudent = await prisma.student.create({
                data: {
                    name: name.trim(),
                    admissionNumber: admissionNumber ? admissionNumber.trim() : null, // Correctly save admission number
                    departmentId,
                    amountPaid,
                    status,
                    target: 5000,
                },
                select: {
                    id: true,
                    name: true,
                    departmentId: true,
                    amountPaid: true,
                    status: true,
                    target: true,
                    createdAt: true,
                    updatedAt: true,
                    admissionNumber: true
                }
            });

            await prisma.contribution.create({
                data: {
                    amount: amountPaid,
                    studentId: newStudent.id
                }
            });

            return NextResponse.json(newStudent);
        } catch (dbError: any) {
            // Handle unique constraint violation for admissionNumber explicitly
            if (dbError.code === 'P2002' && dbError.meta?.target?.includes('admissionNumber')) {
                return NextResponse.json(
                    { error: `Admission Number "${admissionNumber}" is already in use.` },
                    { status: 400 }
                );
            }
            throw dbError;
        }

    } catch (error: any) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { error: "Failed to create student", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, admissionNumber, departmentId, amountPaid } = body;

        if (!id) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        // Validate duplicates if admission number is changing
        if (admissionNumber) {
            const existing = await prisma.student.findUnique({
                where: { admissionNumber: admissionNumber.trim() }
            });
            if (existing && existing.id !== id) {
                return NextResponse.json(
                    { error: `Admission Number "${admissionNumber}" is already in use by another student.` },
                    { status: 400 }
                );
            }
        }

        const newStatus = amountPaid >= 5000 ? "COMPLETED" : amountPaid > 0 ? "PARTIAL" : "PENDING";

        const updatedStudent = await prisma.student.update({
            where: { id },
            data: {
                name: name ? name.trim() : undefined,
                admissionNumber: admissionNumber ? admissionNumber.trim() : undefined,
                departmentId: departmentId || undefined,
                amountPaid: amountPaid !== undefined ? amountPaid : undefined,
                status: amountPaid !== undefined ? newStatus : undefined,
            },
        });

        return NextResponse.json(updatedStudent);

    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json(
            { error: "Failed to update student", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { ids, deleteAll } = body;

        if (deleteAll) {
            await prisma.contribution.deleteMany({});
            await prisma.student.deleteMany({});
            return NextResponse.json({ message: "All students deleted successfully" });
        }

        if (ids && Array.isArray(ids) && ids.length > 0) {
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
