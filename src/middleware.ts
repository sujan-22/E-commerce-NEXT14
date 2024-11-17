import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = [
    "/",
    "/products/[productId]",
    "/products/category/[category]",
    "/cart",
];

export async function middleware(request: NextRequest) {
    const user = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    const path = request.nextUrl.pathname;
    if (!user && path.includes("addproduct")) {
        return Response.redirect(new URL("/unauthorized", request.url));
    }
}
