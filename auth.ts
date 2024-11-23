import NextAuth, { AuthError } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

interface Credentials {
    email: string;
    password: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(
                credentials: Partial<Record<"email" | "password", unknown>>,
                request
            ) {
                if (
                    !credentials ||
                    !credentials.email ||
                    !credentials.password
                ) {
                    throw new AuthError("Email and password are required.");
                }

                // Cast credentials to `Credentials` type
                const { email, password } = credentials as Credentials;

                const client = await clientPromise;
                const db = client.db();

                let user = await db.collection("users").findOne({ email });

                let isSeller = false;

                if (!user) {
                    user = await db.collection("sellers").findOne({ email });

                    if (user) {
                        isSeller = true;
                    }
                }

                if (!user) {
                    throw new AuthError(
                        "No user found with the entered email."
                    );
                }

                const isValid = await compare(password, user.password);
                if (!isValid) {
                    throw new AuthError("Password is incorrect.");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    isSeller,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.seller = user.isSeller || false;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.seller = token.seller || false;
            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
});
