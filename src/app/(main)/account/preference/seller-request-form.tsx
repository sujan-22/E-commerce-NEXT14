"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { requestSellerAccess } from "./actions";
import { useRouter } from "next/navigation";

const sellerRequestFormSchema = z.object({
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions.",
    }),
    acceptDenial: z.boolean().refine((val) => val === true, {
        message: "You must acknowledge that your request can be denied.",
    }),
    agreeRevocation: z.boolean().refine((val) => val === true, {
        message: "You must acknowledge that your seller access can be revoked.",
    }),
    agreeProductReview: z.boolean().refine((val) => val === true, {
        message: "You must agree that your products will be reviewed.",
    }),
    marketingAgreement: z.boolean().default(false),
});

type SellerRequestFormValues = z.infer<typeof sellerRequestFormSchema>;

// Default values
const defaultValues: Partial<SellerRequestFormValues> = {
    marketingAgreement: false,
};

export interface IData {
    success: boolean;
    message: string | unknown;
    request?: {
        id: string;
        userId: string;
        status: "approved" | "pending" | "denied";
        denialReason: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
}

export function SellerRequestForm() {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<SellerRequestFormValues>({
        resolver: zodResolver(sellerRequestFormSchema),
        defaultValues,
    });

    const { mutate: requestAccess, isPending } = useMutation<IData>({
        mutationKey: ["request-seller-access"],
        mutationFn: requestSellerAccess,
        onSuccess: () => {
            toast({
                title: "Seller request submitted successfully",
                description:
                    "Your seller request has been submitted. We will review it and let you know if we approve your request or need to make any changes.",
            });
        },
        onError: () => {
            toast({
                title: "Error creating checkout session",
                description: "Please try again later",
                variant: "destructive",
            });
        },
    });

    function onSubmit() {
        requestAccess();
        router.push("/account/preference");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <h3 className="mb-4 text-lg font-medium">
                        Request to Become a Seller
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Fill out the form below to request seller access. You
                        must agree to our terms and conditions before submitting
                        your request.
                    </p>
                    <div className="space-y-4 mt-6">
                        <FormField
                            control={form.control}
                            name="acceptTerms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I agree to the terms and conditions
                                        </FormLabel>
                                        <FormDescription>
                                            You must agree to our seller terms
                                            before proceeding.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="acceptDenial"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I understand that my request can be
                                            denied
                                        </FormLabel>
                                        <FormDescription>
                                            Acknowledging that your request is
                                            subject to approval.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agreeRevocation"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I agree that my seller access can be
                                            revoked if necessary
                                        </FormLabel>
                                        <FormDescription>
                                            Seller access may be revoked if
                                            suspicious activity is detected.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agreeProductReview"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I agree that each product will be
                                            reviewed before going live
                                        </FormLabel>
                                        <FormDescription>
                                            Ensuring product compliance with
                                            platform standards.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Request"}
                </Button>
            </form>
        </Form>
    );
}
