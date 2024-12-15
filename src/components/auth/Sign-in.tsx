"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../../../auth-client";
import { ErrorContext } from "@better-fetch/fetch";

const SignInTab = ({
    setDialogOpen,
}: {
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const [pendingCredentials, setPendingCredentials] = useState(false);
    // const [pendingGithub, setPendingGithub] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleCredentialsSignIn = async (
        values: z.infer<typeof signInSchema>
    ) => {
        await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
            },
            {
                onRequest: () => {
                    setPendingCredentials(true);
                },
                onSuccess: async () => {
                    router.push("/");
                    router.refresh();
                    setDialogOpen(false);
                },
                onError: (ctx: ErrorContext) => {
                    console.log(ctx);
                    toast({
                        title: "Something went wrong",
                        description:
                            ctx.error.message ?? "Something went wrong.",
                        variant: "destructive",
                    });
                },
            }
        );
        setPendingCredentials(false);
    };
    return (
        <div>
            <TabsContent value="sign-in">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Enter your account details to sign in.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(
                                    handleCredentialsSignIn
                                )}
                                className="space-y-6"
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
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <DialogClose asChild>
                            <Button type="button">Close</Button>
                        </DialogClose>
                        <Button
                            isLoading={pendingCredentials}
                            type="button"
                            onClick={form.handleSubmit(handleCredentialsSignIn)}
                        >
                            Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </div>
    );
};

export default SignInTab;
