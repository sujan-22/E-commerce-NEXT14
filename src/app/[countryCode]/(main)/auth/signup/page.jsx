// app/auth/signup/page.jsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validationSchema";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUp() {
    const methods = useForm({
        resolver: zodResolver(signUpSchema),
    });

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch("/api/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to register.");
                methods.setError("root", { message: result.error });
            } else {
                toast.success("User registered successfully!");
                router.push("/auth/signin");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MaxWidthWrapper className="flex justify-center items-center">
            <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Image
                            src={"/assets/light-logo.png"}
                            alt="logo"
                            width={60}
                            height={50}
                        />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
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
                                            name="name"
                                            render={({ field }) => (
                                                <>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Your Name"
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

                                    <Button isLoading={loading}>Sign up</Button>
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
                        <a href="/auth/signin">
                            <Button className="w-full" isLoading={loading}>
                                Sign in
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
