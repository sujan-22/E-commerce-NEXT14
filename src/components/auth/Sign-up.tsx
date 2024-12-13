"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
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
    FormItem,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "../../../auth-client";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const SignUpTab = ({
    setDialogOpen,
}: {
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const [pending, setPending] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        await authClient.signUp.email(
            {
                email: values.email,
                password: values.password,
                name: values.name,
            },
            {
                onRequest: () => {
                    setPending(true);
                },
                onSuccess: () => {
                    toast({
                        title: "Account created",
                        description:
                            "Your account has been created. Check your email for a verification link.",
                    });
                    router.push("/ca");
                    setDialogOpen(false);
                },
                onError: (ctx) => {
                    console.log("error", ctx);
                    toast({
                        title: "Something went wrong",
                        description:
                            ctx.error.message ?? "Something went wrong.",
                    });
                },
            }
        );
        setPending(false);
    };
    return (
        <div>
            <TabsContent value="sign-up">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Create a new account by filling in the details
                            below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-2"
                            >
                                {[
                                    "name",
                                    "email",
                                    "password",
                                    "confirmPassword",
                                ].map((field) => (
                                    <FormField
                                        control={form.control}
                                        key={field}
                                        name={
                                            field as keyof z.infer<
                                                typeof signUpSchema
                                            >
                                        }
                                        render={({ field: fieldProps }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field
                                                        .replace(
                                                            /([a-z])([A-Z])/g,
                                                            "$1 $2"
                                                        )
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        field
                                                            .replace(
                                                                /([a-z])([A-Z])/g,
                                                                "$1 $2"
                                                            )
                                                            .slice(1)}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={
                                                            field.includes(
                                                                "password"
                                                            )
                                                                ? "password"
                                                                : field ===
                                                                  "email"
                                                                ? "email"
                                                                : "text"
                                                        }
                                                        placeholder={`Enter your ${field}`}
                                                        {...fieldProps}
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <DialogClose asChild>
                            <Button type="button">Close</Button>
                        </DialogClose>
                        <Button
                            isLoading={pending}
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            Sign Up
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </div>
    );
};

export default SignUpTab;
