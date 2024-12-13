import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpTab from "./auth/Sign-up";
import SignInTab from "./auth/Sign-in";

export default function Dialogbox({ isDialogOpen, setDialogOpen }) {
    // const router = useRouter();
    // const cartItems = useStore((state) => state.cartItems);
    // const clearCart = useStore((state) => state.clearCart);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            {/* <DialogTrigger asChild>
        <Button variant="outline">Sign in</Button>
      </DialogTrigger> */}
            <DialogContent className="w-[85%] sm:max-w-md sm:px-6 sm:py-8 p-4">
                <Tabs defaultValue="sign-in" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* Sign In Tab */}
                    <SignInTab setDialogOpen={setDialogOpen} />
                    {/* Sign Up Tab */}
                    <SignUpTab setDialogOpen={setDialogOpen} />
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
