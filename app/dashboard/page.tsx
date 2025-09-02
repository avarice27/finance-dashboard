import { FinancialOverview } from "@/components/financial-overview";
import { AccountManager } from "@/components/account-manager";
import { TransactionManager } from "@/components/transaction-manager";
import { BudgetTracker } from "@/components/budget-tracker";
import { FinancialReports } from "@/components/financial-reports";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:gap-8">
        <FinancialOverview />
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <AccountManager />
          <BudgetTracker />
        </div>
        
        <TransactionManager />
        
        <FinancialReports />
      </div>
    </div>
  );
}