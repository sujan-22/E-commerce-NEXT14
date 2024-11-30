import { AuthError } from "next-auth";
import clientPromise from "../mongodb";
import { compare } from "bcryptjs";

// Define the return type for the user
interface User {
    id: string;
    name: string;
    email: string;
    is_seller: boolean;
}

// Find a user by email and compare the password
export const getUserByEmailAndPassword = async (
    email: string,
    password: string
): Promise<User> => {
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
        throw new AuthError("No user found with the entered email.");
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
        throw new AuthError("Password is incorrect.");
    }

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        is_seller: isSeller,
    };
};
