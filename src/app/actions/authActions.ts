"use server";

import { signOut, signIn } from "../../../auth";
import { AuthError } from "next-auth";
import useStore from "@/context/useStore";

export async function handleCredentialsSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false, // Disable automatic redirection
    });

    if (response?.error) {
      return { message: response.error };
    }
    return {}; // Success, no errors
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.message.replace(/\. Read more at.*$/, "") };
    }
    throw error;
  }
}

export async function handleSignOut() {
  useStore.getState().logoutUser(); // Clear user data from the store
  await signOut(); // Perform the sign-out operation
}
