import { ClientOnly } from "@/components/Clientonly";
import SWPCalculator from "@/components/swp-calculator/SWPCalculator";

export default function DashboardPage() {
  return (
    <div className="p-4">
      <ClientOnly>
        <SWPCalculator />
      </ClientOnly>
    </div>
  );
}
