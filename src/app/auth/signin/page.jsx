// app/auth/signin/page.jsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validationSchema";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { handleCredentialsSignIn } from "@/app/actions/authActions";
import { toast } from "sonner";

export default function SignIn() {
    const methods = useForm({
        resolver: zodResolver(signInSchema),
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true); // Start loading
        try {
            const result = await handleCredentialsSignIn(data);
            if (result.message) {
                toast.error(result.message);
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Unexpected error during sign-in:", error);
            methods.setError("root", {
                type: "manual",
                message:
                    "An unexpected error occurred. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MaxWidthWrapper className={" flex justify-center items-center"}>
            <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <h1 className="text-8xl font-extralight mb-10">DIGI</h1>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sign in to your account
                        </h1>

                        <Link
                            className="text-blue-500 underline"
                            href="/sign-up"
                        >
                            Don&apos;t have an account? Create one!
                            <ArrowRight className="h-4 w-4 inline-block" />
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        <Form {...methods}>
                            <form
                                onSubmit={methods.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <div className="grid gap-2">
                                    <div className="grid gap-1 py-2">
                                        <FormField
                                            name="email"
                                            render={({ field }) => (
                                                <>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your-email@example.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-1 py-2">
                                        <FormField
                                            name="password"
                                            render={({ field }) => (
                                                <>
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="********"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </>
                                            )}
                                        />
                                    </div>

                                    <Button>Sign in</Button>
                                </div>
                            </form>
                        </Form>
                        <div className="relative">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 flex items-center"
                            >
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    or
                                </span>
                            </div>
                        </div>
                        <Button isLoading={true}>Sign up</Button>
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
