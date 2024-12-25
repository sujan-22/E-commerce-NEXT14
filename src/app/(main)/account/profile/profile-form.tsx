"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { getEmailSchema, getNameSchema } from "@/lib/zod";
import { useToast } from "@/components/ui/use-toast";
import AccountInfo from "@/components/account/AccountInfo";

const profileFormSchema = z.object({
  username: getNameSchema().optional(),
  email: getEmailSchema().optional(),
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
  const { toast } = useToast();
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
      // Check if updates are needed
      const promises = [];

      // Update Username
      if (data.username && data.username !== currentUser?.name) {
        promises.push(
          authClient.updateUser({
            name: data.username,
          })
        );
      }

      // Update Email
      if (data.email && data.email !== currentUser?.email) {
        promises.push(
          authClient.changeEmail({
            newEmail: data.email,
          })
        );
      }

      // Update Password
      if (data.password && data.password.trim() !== "") {
        promises.push(
          authClient.changePassword({
            newPassword: data.password,
            currentPassword: "12345678", // Replace with the correct logic to get current password
            revokeOtherSessions: true,
          })
        );
      }

      if (promises.length === 0) {
        toast({
          title: "No changes",
        });
        return;
      }

      // Wait for all updates to complete
      await Promise.all(promises);

      toast({
        title: "Profile Updated",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
      });
    }
  }

  return <></>;
}
