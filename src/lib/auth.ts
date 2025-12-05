import { cookies } from "next/headers";
import { AUTH_CONFIG } from "./auth-config";

export async function checkAuth(type: "admin" | "developer"): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const config = AUTH_CONFIG[type];
        const sessionCookie = cookieStore.get(config.cookieName);

        if (!sessionCookie?.value) {
            return false;
        }

        // Decode and validate the session
        const sessionData = JSON.parse(
            Buffer.from(sessionCookie.value, 'base64').toString()
        );

        // Check if session is expired
        if (Date.now() > sessionData.expires) {
            return false;
        }

        // Check if session type matches
        if (sessionData.type !== type) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Auth check error:", error);
        return false;
    }
}
