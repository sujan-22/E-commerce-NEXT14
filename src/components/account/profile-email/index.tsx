"use client";
import React, { useEffect, useState } from "react";
import { authClient, IUser } from "auth-client";
import AccountInfo from "../AccountInfo";
import { Input } from "@/components/ui/input";
import useUserStore from "@/context/useUserStore";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { getEmailSchema } from "@/lib/zod";

// Email validation schema
const profileFormSchema = z.object({
  email: getEmailSchema().optional(),
});

const ProfileEmail = ({ currentUser }: { currentUser: IUser }) => {
  const [successState, setSuccessState] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // Access the setCurrentUser function from the store
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  // Determine if there are changes in the email
  const hasChanges = email.trim() !== currentUser?.email;

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const validateEmail = (email: string) => {
    try {
      profileFormSchema.parse({ email });
      return null; // Valid email, no error
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message; // Return the validation error message
      }
      return "An unexpected error occurred.";
    }
  };

  const updateCustomerEmail = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      // Validate email before making API call
      const validationError = validateEmail(email);
      if (validationError) {
        setErrorState(validationError);
        return;
      }

      await authClient.changeEmail({
        newEmail: email,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/account/profile`,
      });

      // Update the currentUser in the store with the new email
      setCurrentUser({ ...currentUser, email });
      setSuccessState(true);
      toast({ description: `Email saved successfully` });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating email:", error);
      setErrorState(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setSuccessState(false);
    setErrorState(null);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (hasChanges) {
          updateCustomerEmail();
        }
      }}
      className="w-full overflow-visible space-y-4 md:space-y-6"
    >
      <AccountInfo
        label="Email"
        currentInfo={currentUser.email}
        isSuccess={successState}
        isError={!!errorState}
        clearState={clearState}
        data-testid="account-email-editor"
        isLoading={loading}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Input
            name="email"
            required
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto flex-grow"
            data-testid="email-input"
          />
        </div>

        {errorState && (
          <p className="text-red-500 mt-2 text-sm">{errorState}</p>
        )}
      </AccountInfo>
    </form>
  );
};

export default ProfileEmail;
