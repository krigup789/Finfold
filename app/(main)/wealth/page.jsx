"use client";

import { ClientOnly } from "@/components/Clientonly";
import WealthCalculator from "@/components/wealth-calculator/WealthCalculator";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function DashboardPage() {
  return (
    <div
      className={`
        px-5 
        transition-colors duration-300
        bg-white text-black
        dark:bg-gray-900 dark:text-white
      `}
    >
      <div className="flex text-center items-center justify-between mb-5">
        {/* Optional Title */}
        {/* <h1 className="flex text-6xl font-bold tracking-tight">
          Wealth Calculator
        </h1> */}
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <ClientOnly>
          <WealthCalculator />
        </ClientOnly>
      </Suspense>
    </div>
  );
}
