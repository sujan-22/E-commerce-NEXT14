import React, { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpTab from "./Sign-up";
import SignInTab from "./Sign-in";

interface IAuthDialog {
    isDialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
    redirectTo?: string;
}

const AuthDialog: React.FC<IAuthDialog> = ({
    isDialogOpen,
    setDialogOpen,
    redirectTo,
}) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="w-[85%] sm:max-w-md sm:px-6 sm:py-8 p-4">
                <Tabs defaultValue="sign-in" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>
                    <SignInTab
                        setDialogOpen={setDialogOpen}
                        redirectTo={redirectTo}
                    />
                    <SignUpTab
                        setDialogOpen={setDialogOpen}
                        redirectTo={redirectTo}
                    />
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;
