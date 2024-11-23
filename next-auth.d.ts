// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            seller: boolean;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        password: string;
        isSeller: boolean;
    }

    interface JWT {
        id: string;
        seller: boolean;
    }
}
