import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentId, amount } = body;

        if (!studentId) {
            return NextResponse.json(
                { error: "Student ID is required" },
                { status: 400 }
            );
        }

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Amount must be greater than 0" },
                { status: 400 }
            );
        }

        // Get current student
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        // Calculate new total
        const newTotal = student.amountPaid + amount;

        // Determine new status
        let newStatus = "PARTIAL";
        if (newTotal >= student.target) {
            newStatus = "COMPLETED";
        } else if (newTotal === 0) {
            newStatus = "PENDING";
        }

        // Update student
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                amountPaid: newTotal,
                status: newStatus,
            },
        });

        // Create a contribution record
        await prisma.contribution.create({
            data: {
                amount: amount,
                studentId: studentId,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Payment updated successfully",
            previousAmount: student.amountPaid,
            addedAmount: amount,
            newTotal: updatedStudent.amountPaid,
            status: newStatus,
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { error: "Failed to update payment" },
            { status: 500 }
        );
    }
}
