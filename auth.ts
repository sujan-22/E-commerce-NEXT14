import NextAuth, { AuthError } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { signInSchema } from "@/lib/validationSchema";
import { getUserByEmailAndPassword } from "@/lib/user/getUserByEmailAndPassword";

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
                const validateFields = signInSchema.safeParse(credentials);
                if (
                    !credentials ||
                    !credentials.email ||
                    !credentials.password
                ) {
                    throw new AuthError("Email and password are required.");
                }
                if (validateFields.success) {
                    const { email, password } = validateFields.data;
                    const user = await getUserByEmailAndPassword(
                        email,
                        password
                    );

                    if (!user) {
                        return null;
                    }

                    return user;
                }

                return null;
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
                token.is_seller = user.is_seller || false;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.is_seller = token.is_seller || false;
            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
});
