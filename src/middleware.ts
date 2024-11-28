// // const { auth } = NextAuth(authConfig);
// import {
//     authRoutes,
//     publicRoutes,
//     DEFAULT_LOGIN_REDIRECT,
//     apiAuthPrefix,
// } from "../routes";
// import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import type { NextRequest } from "next/server";
import {
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
} from "routes";

export async function middleware(request: NextRequest) {
    const user = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });
    const path = request.nextUrl.pathname;

    const isApiAuthRoute = path.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(path);
    const isAuthRoute = authRoutes.includes(path);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (user) {
            return Response.redirect(
                new URL(DEFAULT_LOGIN_REDIRECT, request.url)
            );
        }
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
    }

    // if (!user && !isPublicRoute) {
    //     return Response.redirect(new URL("/unauthorized", request.url));
    // }
}

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.*\\..*|_next|api/|trpc/).*)", "/", "/"],
};
