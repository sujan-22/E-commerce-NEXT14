// "use server";

// import useStore from "@/context/useStore";
// import { signOut, signIn } from "../../../../auth";
// import { AuthError } from "next-auth";

// export async function handleCredentialsSignIn({
//     email,
//     password,
// }: {
//     email: string;
//     password: string;
// }) {
//     try {
//         const response = await signIn("credentials", {
//             email,
//             password,
//             redirect: false,
//         });

//         if (response?.error) {
//             return { message: response.error };
//         }

//         const localCartItems = useStore.getState().cartItems;
//         const userId = response.user?.id;

//         if (userId && localCartItems.length > 0) {
//             const mergeCartResponse = await fetch("/cart/merge", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     userId,
//                     localCartItems,
//                 }),
//             });

//             if (mergeCartResponse.ok) {
//                 await mergeCartResponse.json();
//             } else {
//                 console.error("Failed to merge cart");
//             }
//         }

//         return {}; // Success, no errors
//     } catch (error) {
//         if (error instanceof AuthError) {
//             return { message: error.message.replace(/\. Read more at.*$/, "") };
//         }
//     }
// }

// export async function handleSignOut() {
//     await signOut({ redirect: false });
// }
