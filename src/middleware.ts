// // const { auth } = NextAuth(authConfig);
// import {
//     authRoutes,
//     publicRoutes,
//     DEFAULT_LOGIN_REDIRECT,
//     apiAuthPrefix,
// } from "../routes";
// import { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//     const { nextUrl } = req;
//     const user = await getToken({
//         req: req,
//         secret: process.env.AUTH_SECRET,
//     });

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//     if (isApiAuthRoute) {
//         return null;
//     }

//     if (isAuthRoute) {
//         if (user) {
//             return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//         }
//         return {
//             redirect: DEFAULT_LOGIN_REDIRECT,
//         };
//     }

//     if (!user && !isPublicRoute) {
//         return Response.redirect(new URL("/auth/signin", nextUrl));
//     }

//     return null;
// }

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//     matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

export default function middleware() {
    return NextResponse.next();
}
