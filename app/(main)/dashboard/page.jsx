// app/dashboard/page.jsx (or wherever your DashboardPage is)
import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { getCashFlow } from "@/actions/cashflow";

import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import NetWorth from "./_components/net-worth";
import { CashFlowCard } from "./_components/cashflow";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

// ----------------------
// Budget Section Wrapper
// ----------------------
async function BudgetSection({ accounts }) {
  const defaultAccount = accounts?.find((a) => a.isDefault);
  if (!defaultAccount) return null;

  const budgetData = await getCurrentBudget(defaultAccount.id);

  return (
    <BudgetProgress
      initialBudget={budgetData?.budget}
      currentExpenses={budgetData?.currentExpenses || 0}
    />
  );
}

// ----------------------
// Net Worth Wrapper
// ----------------------
function NetWorthSection({ accounts }) {
  return <NetWorth accounts={accounts} />;
}

// ----------------------
// Transactions Wrapper
// ----------------------
async function TransactionsSection({ accountsPromise, transactionsPromise }) {
  const [accounts, transactions] = await Promise.all([
    accountsPromise,
    transactionsPromise,
  ]);

  return (
    <DashboardOverview accounts={accounts} transactions={transactions || []} />
  );
}

// ----------------------
// Cash Flow Wrapper
// ----------------------
async function CashFlowSection({ accounts }) {
  const defaultAccount = accounts?.find((a) => a.isDefault);
  if (!defaultAccount) return null;

  const cashFlowData = await getCashFlow(defaultAccount.id);

  return (
    <CashFlowCard
      initialCashFlow={cashFlowData?.transaction}
      income={cashFlowData?.income}
      expense={cashFlowData?.expense || 0}
      invested={cashFlowData?.invested || 0}
      net={cashFlowData?.net || 0}
    />
  );
}

// ----------------------
// Main Dashboard Page
// ----------------------
export default async function DashboardPage() {
  // Start both queries in parallel
  const accountsPromise = getUserAccounts();
  const transactionsPromise = getDashboardData();

  // Resolve accounts immediately (needed for multiple sections)
  const accounts = await accountsPromise;

  return (
    <div className="space-y-8">
      {/* Budget Tracker */}
      <Suspense
        fallback={<div className="animate-pulse">Loading budget...</div>}
      >
        <BudgetSection accounts={accounts} />
      </Suspense>

      {/* Net Worth Summary */}
      <Suspense
        fallback={<div className="animate-pulse">Loading net worth...</div>}
      >
        <NetWorthSection accounts={accounts} />
      </Suspense>

      {/* Income vs Expenses Chart */}
      <Suspense
        fallback={<div className="animate-pulse">Loading transactions...</div>}
      >
        <TransactionsSection
          accountsPromise={accountsPromise}
          transactionsPromise={transactionsPromise}
        />
      </Suspense>

      {/* Cash Flow Overview */}
      <Suspense
        fallback={<div className="animate-pulse">Loading cash flow...</div>}
      >
        <CashFlowSection accounts={accounts} />
      </Suspense>

      {/* Investment Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {/* Add New Investment Card */}
        <CreateAccountDrawer>
          <Card className="min-h-[200px] border-dashed hover:shadow-md cursor-pointer bg-card text-muted-foreground transition-shadow">
            <CardContent className="flex flex-col items-center justify-center h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Investment</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Investment Cards */}
        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  );
}
