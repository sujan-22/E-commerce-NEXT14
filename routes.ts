/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/ca",
    "/about",
    "/contact",
    "/products",
    "/products/[id]",
    "/cart",
    "/products/category/",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to "/"
 * @type {string[]}
 */
export const authRoutes = ["/auth/signin", "/auth/signup"];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix will be considered as API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path when a user logs in successfully
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/ca";
