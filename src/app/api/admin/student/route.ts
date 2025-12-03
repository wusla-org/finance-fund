import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, departmentId, amountPaid } = body;

        const status = amountPaid >= 5000 ? "COMPLETED" : amountPaid > 0 ? "PARTIAL" : "PENDING";

        const student = await prisma.student.create({
            data: {
                name,
                departmentId,
                amountPaid,
                status,
                target: 5000,
            },
        });

        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
    }
}
