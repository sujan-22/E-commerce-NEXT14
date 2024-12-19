import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    user: {
        additionalFields: {
            premium: {
                type: "boolean",
                required: false,
            },
        },
        changeEmail: {
            enabled: true,
        },
    },
    plugins: [
        openAPI(),
        admin({
            impersonationSessionDuration: 60 * 60 * 24 * 7,
        }),
    ],
    emailAndPassword: {
        enabled: true,
    },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
