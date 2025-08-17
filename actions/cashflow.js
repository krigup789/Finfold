"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ---------------- GET CASH FLOW ----------------
export async function getCashFlow(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Aggregate Income
    const incomeAgg = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "DEPOSIT",
        date: { gte: startOfMonth, lte: endOfMonth },
        accountId,
      },
      _sum: { amount: true },
    });
    const income = incomeAgg._sum.amount ? incomeAgg._sum.amount.toNumber() : 0;

    // Aggregate Expense
    const expenseAgg = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "WITHDRAW",
        date: { gte: startOfMonth, lte: endOfMonth },
        accountId,
      },
      _sum: { amount: true },
    });
    const expense = expenseAgg._sum.amount ? expenseAgg._sum.amount.toNumber() : 0;

    // Aggregate Invested
    const investedAgg = await db.account.aggregate({
      where: {
        userId: user.id,
        type: { in: ["STOCK", "MUTUAL_FUND", "FD", "CRYPTO", "GOLD", "REAL_ESTATE", "OTHER"] },
      },
      _sum: { balance: true },
    });
    const invested = investedAgg._sum.balance ? investedAgg._sum.balance.toNumber() : 0;

    // Calculate Net
    const net = income - expense;

    return {
      income,
      expense,
      invested,
      net,
    };
  } catch (error) {
    console.error("Error fetching cash flow:", error);
    throw error;
  }
}

// ---------------- UPDATE CASH FLOW ----------------
export async function updateCashFlow(amount, balance) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Create a new transaction for the given amount
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        amount,
        type: amount >= 0 ? "DEPOSIT" : "WITHDRAW", // decide based on sign
        date: new Date(),
      },
    });

    // Update total balance in account table
    // Assuming there is a main account for the user
    await db.account.updateMany({
      where: { userId: user.id },
      data: { balance },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        ...transaction,
        amount: transaction.amount ? transaction.amount.toNumber() : 0,
      },
    };
  } catch (error) {
    console.error("Error updating cash flow:", error);
    return { success: false, error: error.message };
  }
}
