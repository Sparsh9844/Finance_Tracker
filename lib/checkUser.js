import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const loggedInUser = await db.user.upsert({
      where: { clerkUserId: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        name: name,
      },
      create: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        name: name,
      },
    });

    return loggedInUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    return null;
  }
};
