// Authentication configuration
// In production, use environment variables instead

export const AUTH_CONFIG = {
    admin: {
        password: process.env.ADMIN_PASSWORD || "admin123",
        cookieName: "admin_auth",
    },
    developer: {
        password: process.env.DEVELOPER_PASSWORD || "dev123",
        cookieName: "dev_auth",
    },
    // Session expires in 24 hours
    sessionDuration: 24 * 60 * 60 * 1000,
};
