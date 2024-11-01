// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string; // Add the id property to the User type
    }

    interface Session {
        user: User; // Extend the Session user type
    }

    interface JWT {
        id: string; // Add the id property to the JWT type
    }
}
