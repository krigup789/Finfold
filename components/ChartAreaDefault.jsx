"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";

const DATE_RANGES = {
  "1M": { label: "Last Month", months: 1 },
  "3M": { label: "Last 3 Months", months: 3 },
  "6M": { label: "Last 6 Months", months: 6 },
  "1Y": { label: "Last 1 Year", months: 12 },
  ALL: { label: "All Time", months: null },
};

// ✅ Currency formatter for INR
const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export function ChartAreaDefault({ accounts }) {
  const [dateRange, setDateRange] = useState("6M");

  const chartData = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    const now = new Date();
    const range = DATE_RANGES[dateRange];

    const startDate = range.months
      ? startOfMonth(subMonths(now, range.months))
      : accounts.reduce((min, acc) => {
          const date = new Date(acc.createdAt);
          return date < min ? date : min;
        }, new Date());

    const endDate = endOfMonth(now);

    // Generate list of months
    const months = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      months.push(format(current, "yyyy-MM"));
      current = addMonths(current, 1);
    }

    let runningTotal = 0;

    return months.map((monthKey) => {
      const monthStart = new Date(`${monthKey}-01`);
      const monthEnd = addMonths(monthStart, 1);

      accounts.forEach((account) => {
        const accountCreatedAt = new Date(account.createdAt);

        // Add initial balance once on account creation
        if (accountCreatedAt >= monthStart && accountCreatedAt < monthEnd) {
          runningTotal += parseFloat(account.balance || 0);
        }

        // Apply transactions
        account.transactions?.forEach((txn) => {
          const txnDate = new Date(txn.date);
          if (txnDate >= monthStart && txnDate < monthEnd) {
            runningTotal +=
              txn.type === "DEPOSIT"
                ? parseFloat(txn.amount)
                : -parseFloat(txn.amount);
          }
        });
      });

      return {
        month: monthKey,
        balance: Math.max(runningTotal, 0),
      };
    });
  }, [accounts, dateRange]);

  const latestNetWorth = chartData[chartData.length - 1]?.balance ?? 0;
  const firstNetWorth = chartData[0]?.balance ?? 0;
  const isTrendingUp = latestNetWorth >= firstNetWorth;

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="hover:shadow-md transition-shadow bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>No accounts found</CardTitle>
          <CardDescription>
            Net worth chart cannot be displayed.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow bg-card text-card-foreground">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-6 pb-5">
        {/* Left side: Title + Description */}
        <div className="flex flex-col">
          <CardTitle className="text-3xl sm:text-4xl font-semibold">Net Worth</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Showing monthly trend of net worth
          </CardDescription>
        </div>

        {/* Right side: Value + Date Range */}
        <div className="flex flex-col sm:items-end gap-3">
          {/* Net worth value */}
          <div className="text-3xl sm:text-5xl font-semibold text-foreground">
            {formatINR(latestNetWorth)}
          </div>

          {/* Date range select */}
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              className="w-full sm:w-[160px] border border-border bg-background text-foreground
                        placeholder:text-muted-foreground focus:ring-2 
                        focus:ring-ring rounded-md px-3 py-2"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>

            <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-md">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>





      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tick={{ fill: "hsl(var(--foreground))" }}
              tickFormatter={(value) =>
                format(new Date(`${value}-01`), "MMM yyyy")
              }
            />
            <Tooltip
              formatter={(value) => [formatINR(Math.max(0, value)), "Net Worth"]}
              labelFormatter={(label) =>
                format(new Date(`${label}-01`), "MMM yyyy")
              }
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                padding: "8px 12px",
                fontSize: "12px",
              }}
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="#22c55e"
              stroke="#16a34a"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium">
              {isTrendingUp ? "Trending up" : "Trending down"}
              <TrendingUp
                className={`h-4 w-4 ${
                  isTrendingUp
                    ? "text-green-600"
                    : "text-red-600 rotate-180"
                }`}
              />
            </div>
            <div className="text-muted-foreground">
              {chartData[0]?.month
                ? format(new Date(`${chartData[0].month}-01`), "MMM yyyy")
                : ""}
              {" – "}
              {chartData[chartData.length - 1]?.month
                ? format(
                    new Date(`${chartData[chartData.length - 1].month}-01`),
                    "MMM yyyy"
                  )
                : ""}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
