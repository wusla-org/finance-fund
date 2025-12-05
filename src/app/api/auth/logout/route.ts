import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type } = body;

        const cookieStore = await cookies();

        if (type === 'admin') {
            cookieStore.delete('admin_auth');
        } else if (type === 'developer') {
            cookieStore.delete('dev_auth');
        }

        return NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}
