import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "auth";

const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const adminRoutes = ["/admin"];
const protectedRoutes = ["/account", "/checkout", "/addproduct"];

export default async function authMiddleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    // Check if the route is in one of the special categories
    const isAuthRoute = authRoutes.includes(pathName);
    const isPasswordRoute = passwordRoutes.includes(pathName);
    const isAdminRoute = adminRoutes.includes(pathName);
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathName.startsWith(route)
    );

    // Fetch session information from the backend
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: process.env.BETTER_AUTH_URL,
            headers: {
                // Include the cookie in the request
                cookie: request.headers.get("cookie") || "",
            },
        }
    );

    // // If the user is not authenticated and the route is protected
    // if (!session) {
    //     // Allow access to auth and password routes
    //     if (isAuthRoute || isPasswordRoute) {
    //         return NextResponse.next();
    //     }
    //     // Redirect unauthenticated users to the sign-in page
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // If the user is authenticated and trying to access auth or password routes, redirect them to home
    if (isAuthRoute || isPasswordRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Handle admin routes
    if (isAdminRoute && session.user.role !== "admin") {
        // If the user is not an admin, redirect them to the home page
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If the user is not authenticated but is accessing protected routes, redirect to sign-in
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

// Configure the middleware to apply to all routes except the ones excluded (API, static files, etc.)
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
