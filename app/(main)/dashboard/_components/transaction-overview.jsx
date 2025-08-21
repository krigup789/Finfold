"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Custom tooltip component using Tailwind classes
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-md border px-3 py-2 text-sm shadow-md 
                bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
    >
      <p className="font-medium">{label}</p>
      <p>₹{payload[0].value.toFixed(2)} Spent</p>
    </div>
  );
};

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // ✅ Update selectedAccountId whenever accounts change
  useEffect(() => {
    const defaultAccount = accounts.find((a) => a.isDefault);
    if (defaultAccount) {
      setSelectedAccountId((prevId) =>
        prevId !== defaultAccount.id ? defaultAccount.id : prevId
      );
    }
  }, [accounts]);


  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "WITHDRAW" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category || "Others";
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  // ✅ Currency formatter for INR
  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="grid gap-6 md:grid-cols-2 min-h-[320px]">
      {/* ✅ Recent Transactions Card */}
      <Card className="rounded-2xl border bg-background shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-sm font-semibold text-foreground">
            Recent Transactions
          </CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger
              className="w-[140px] h-8 text-sm border border-border bg-background text-foreground 
                        placeholder:text-muted-foreground rounded-md focus:ring-2 focus:ring-ring"
            >
              <SelectValue placeholder="Select account" />
            </SelectTrigger>

            <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-md">
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </CardHeader>

        <CardContent className="pt-0">
          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              No recent transactions
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentTransactions.map((transaction, index) => (
                <li
                  key={transaction.id}
                  className={cn(
                    "flex items-center justify-between py-4",
                    index === 0 ? "pt-0" : ""
                  )}
                >
                  {/* Left Section */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {transaction.description || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "dd MMM yyyy")}
                    </p>
                  </div>

                  {/* Right Amount Section */}
                  <div
                    className={cn(
                      "flex items-center font-medium text-sm",
                      transaction.type === "WITHDRAW"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {transaction.type === "WITHDRAW" ? (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    )}
                    {formatINR(transaction.amount.toFixed(2))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ✅ Monthly Expense Breakdown */}
      <Card className="rounded-2xl border bg-background shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-foreground">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 pb-6">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70} // hollow center
                    outerRadius={120} // larger overall pie
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ${formatINR(value.toFixed(0))}`
                    }
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />

                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "12px",
                      marginTop: "8px",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
