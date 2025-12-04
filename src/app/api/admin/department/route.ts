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
