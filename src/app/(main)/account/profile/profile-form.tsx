"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/context/useUserStore";
import { betterAuth } from "better-auth";
import { authClient } from "auth-client";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
    username: z.string().min(2).max(30),
    email: z.string().email(),
    password: z.string().min(8).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const auth = betterAuth({
    user: {
        changeEmail: {
            enabled: true,
        },
        changePassword: {
            enabled: true,
        },
    },
});

export function ProfileForm() {
    const router = useRouter();
    const { currentUser } = useUserStore();
    console.log(currentUser);
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            email: currentUser?.email || "",
            username: currentUser?.name || "",
        },
        mode: "onChange",
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            // Update Username
            if (data.username && data.username !== currentUser?.name) {
                await authClient.updateUser({
                    name: data.username,
                });
            }

            // Update Email
            if (data.email && data.email !== currentUser?.email) {
                await authClient.changeEmail({
                    newEmail: data.email,
                });
            }

            // Update Password
            if (data.password) {
                await authClient.changePassword({
                    newPassword: data.password,
                    currentPassword: "11122233",
                    revokeOtherSessions: true,
                });
            }
            toast.success("Email updated successfully!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("There was an issue updating your profile.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your full name"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This will be your name on the platform.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={currentUser?.email}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Change your email address.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter a new password"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Leave blank if you dont want to change your
                                password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    );
}
