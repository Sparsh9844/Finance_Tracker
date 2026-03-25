"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// Uncomment if you use ArcJet
// import { aj } from "@/lib/arcjet";

// Helper to convert Prisma Decimal to number
const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  return serialized;
};

// ✅ Get all user accounts
export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    return accounts.map(serializeTransaction);
  } catch (error) {
    console.error("Error fetching accounts:", error.message);
    throw new Error("Failed to load accounts");
  }
}

// ✅ Create a new account (fixed)
export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 🧩 Optional ArcJet check (only if you have it configured)
    // Remove or comment this section if you don't use ArcJet
    /*
    const decision = await aj.protect({ 
      userId, 
      requested: 1 
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: { remaining, resetInSeconds: reset },
        });
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked by ArcJet");
    }
    */

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Validate and parse balance
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    // Check existing accounts
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // Determine if this should be the default account
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If new account is default, unset previous defaults
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create account
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(account);

    // Revalidate dashboard cache
    revalidatePath("/dashboard");

    return { success: true, data: serializedAccount };
  } catch (error) {
    console.error("Error creating account:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Get dashboard transactions
export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
