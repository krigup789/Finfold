"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevents Link navigation
    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

    // ✅ Currency formatter for INR
  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);


  return (
    <Card className="min-h-[220px] min-w-96 bg-card text-foreground hover:shadow-md transition-shadow group relative flex flex-col justify-between">
      <Link href={`/account/${id}`} className="flex flex-col flex-1 p-4">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-base font-semibold capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1">
          <div className="text-2xl font-bold">
            {formatINR(parseFloat(balance).toFixed(2))}
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {type.toLowerCase()} Account
          </p>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between text-sm text-muted-foreground mt-auto mb-0 pb-0">
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
