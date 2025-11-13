import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

interface FinancialChartsProps {
  financialData: FinancialData[];
}

export function FinancialCharts({ financialData }: FinancialChartsProps) {
  const maxValue = Math.max(
    ...financialData.flatMap((d) => [d.revenue, d.expenses]),
    1
  );

  const totalRevenue = financialData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = financialData.reduce((sum, d) => sum + d.expenses, 0);
  const totalNetIncome = totalRevenue - totalExpenses;
  const profitMargin =
    totalRevenue > 0 ? ((totalNetIncome / totalRevenue) * 100).toFixed(1) : '0';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-6 bg-gunmetal border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Financial Overview
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue and expense trends
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              <p className="text-xs font-medium">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-imperial-red mb-2">
              <TrendingDown className="h-4 w-4" />
              <p className="text-xs font-medium">Expenses</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <DollarSign className="h-4 w-4" />
              <p className="text-xs font-medium">Net Income</p>
            </div>
            <p
              className={`text-2xl font-bold ${
                totalNetIncome >= 0 ? 'text-green-400' : 'text-imperial-red'
              }`}
            >
              {formatCurrency(totalNetIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {profitMargin}% margin
            </p>
          </div>
        </div>

        {/* Revenue vs Expenses Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Revenue vs Expenses
          </h4>
          <div className="space-y-3">
            {financialData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    {item.period}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-400 text-xs">
                      {formatCurrency(item.revenue)}
                    </span>
                    <span className="text-imperial-red text-xs">
                      {formatCurrency(item.expenses)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {/* Revenue bar */}
                  <div className="relative h-4 bg-rich-black rounded overflow-hidden">
                    <div
                      className="absolute h-full bg-green-400 transition-all"
                      style={{ width: `${(item.revenue / maxValue) * 100}%` }}
                    />
                  </div>
                  {/* Expenses bar */}
                  <div className="relative h-4 bg-rich-black rounded overflow-hidden">
                    <div
                      className="absolute h-full bg-imperial-red transition-all"
                      style={{ width: `${(item.expenses / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
                {/* Net income indicator */}
                <div className="flex items-center justify-end">
                  <span
                    className={`text-xs font-medium ${
                      item.netIncome >= 0 ? 'text-green-400' : 'text-imperial-red'
                    }`}
                  >
                    Net: {formatCurrency(item.netIncome)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-imperial-red rounded" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
