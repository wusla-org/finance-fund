import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth-config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password, type } = body;

        if (!type || !['admin', 'developer'].includes(type)) {
            return NextResponse.json(
                { error: "Invalid authentication type" },
                { status: 400 }
            );
        }

        const config = AUTH_CONFIG[type as 'admin' | 'developer'];

        if (password !== config.password) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        // Create session token (simple implementation)
        const sessionToken = Buffer.from(
            JSON.stringify({
                type,
                timestamp: Date.now(),
                expires: Date.now() + AUTH_CONFIG.sessionDuration,
            })
        ).toString('base64');

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set(config.cookieName, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: AUTH_CONFIG.sessionDuration / 1000,
            path: '/',
        });

        return NextResponse.json({
            success: true,
            message: "Authentication successful",
        });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}
