import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Helper to ensure PgBouncer params are present for Postgres URLs
    const getUrl = () => {
        let url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
        if (!url) return undefined;

        // If it's a local SQLite file, don't touch it
        if (url.startsWith('file:')) return url;

        // If it's Postgres and missing pgbouncer param, add it
        if (!url.includes('pgbouncer=true')) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}pgbouncer=true&statement_cache_size=0`;
        }
        return url;
    };

    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        datasources: {
            db: {
                url: getUrl()
            }
        }
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

// Graceful shutdown
if (typeof window === 'undefined') {
    const cleanup = async () => {
        await prisma.$disconnect();
    };

    process.on('beforeExit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}
