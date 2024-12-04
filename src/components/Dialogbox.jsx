import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signUpSchema } from "@/lib/validationSchema";
import { handleCredentialsSignIn } from "@/app/actions/authActions";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import useStore from "@/context/useStore";

export default function Dialogbox({ isDialogOpen, setDialogOpen }) {
  const router = useRouter();
  const cartItems = useStore((state) => state.cartItems);
  const clearCart = useStore((state) => state.clearCart);

  // Dialog state

  // Sign In Form Methods
  const signinMethods = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSigninSubmit = async (data) => {
    try {
      const result = await handleCredentialsSignIn(data);
      if (result.message) {
        toast.error(result.message);
      } else {
        setDialogOpen(false);
        router.push("/ca");
        toast.success("Signed in successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      signinMethods.setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  // Sign Up Form Methods
  const signupMethods = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSignupSubmit = async (data) => {
    try {
      // Check if the "Continue as Seller" checkbox is checked
      if (data.seller) {
        // If so, we send the request to the seller-specific API
        const sellerResponse = await fetch("/api/sign-up/seller", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });

        const sellerResult = await sellerResponse.json();

        if (!sellerResponse.ok) {
          toast.error(sellerResult.error || "Failed to create seller account.");
          signupMethods.setError("root", {
            message: sellerResult.error,
          });
          return;
        }

        const signinResult = await handleCredentialsSignIn({
          email: data.email,
          password: data.password,
        });

        if (signinResult.message) {
          toast.error(signinResult.message);
        } else {
          toast.success(
            "Seller account created successfully! Awaiting approval."
          );
          setDialogOpen(false);
          router.push("/ca");
          window.location.reload();
        }
      } else {
        // Normal user sign-up if not a seller
        const response = await fetch("/api/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            cartItems: cartItems,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Failed to register.");
          signupMethods.setError("root", { message: result.error });
        } else {
          const signinResult = await handleCredentialsSignIn({
            email: data.email,
            password: data.password,
          });

          if (signinResult.message) {
            toast.error(signinResult.message);
          } else {
            setDialogOpen(false);
            router.push("/ca");
            router.refresh();
            clearCart();
          }
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Sign in</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md sm:px-6 sm:py-8 p-4">
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="sign-in">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your account details to sign in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...signinMethods}>
                  <form
                    onSubmit={signinMethods.handleSubmit(onSigninSubmit)}
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
                              <FormLabel>Password</FormLabel>
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
                  type="button"
                  onClick={signinMethods.handleSubmit(onSigninSubmit)}
                >
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="sign-up">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create a new account by filling in the details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...signupMethods}>
                  <form
                    onSubmit={signupMethods.handleSubmit(onSignupSubmit)}
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
                              <FormLabel>Password</FormLabel>
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

                      <div className="items-top flex space-x-2">
                        <FormField
                          name="seller"
                          render={({ field }) => (
                            <>
                              <FormControl>
                                <Checkbox
                                  id="seller"
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                  className="h-4 w-4"
                                />
                              </FormControl>
                              <FormLabel>
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor="seller"
                                    className="text-sm font-medium leading-none"
                                  >
                                    Continue as Seller
                                  </label>
                                  <p className="text-sm text-muted-foreground font-normal">
                                    Your request to become a seller will be
                                    reviewed before you&apos;re able to upload
                                    products.
                                  </p>
                                </div>
                              </FormLabel>
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
                  type="button"
                  onClick={signupMethods.handleSubmit(onSignupSubmit)}
                >
                  Sign Up
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
