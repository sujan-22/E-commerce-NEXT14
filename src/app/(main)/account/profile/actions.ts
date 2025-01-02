"use server";
import db from "@/lib/prisma";

export const deleteUsers = async (userId: string) => {
  try {
    await db.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
};
