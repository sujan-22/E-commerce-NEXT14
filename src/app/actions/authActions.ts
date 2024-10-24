"use server";

import { signOut, signIn } from "../../../auth";
import { AuthError } from "next-auth";

export async function handleCredentialsSignIn({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    try {
        await signIn("credentials", { email, password, redirectTo: "/" });
    } catch (error) {
        if (error instanceof AuthError) {
            // Check for specific error messages
            if (error.message) {
                // Check for specific error messages and return custom ones
                return {
                    message: error.message.replace(/\. Read more at.*$/, ""),
                };
            } else {
                return { message: "Something went wrong during sign-in." };
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut();
}
