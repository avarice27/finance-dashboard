'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  ChartBar,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

export function FinancialOverview() {
  const [overview, setOverview] = useState({
    revenue: { total: 0, change: 0 },
    expenses: { total: 0, change: 0 },
    netIncome: { total: 0, change: 0 },
    cashFlow: { total: 0, change: 0 }
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        // In a real app, this would fetch from our API
        // const response = await fetch('/api/finance/reports?type=overview');
        // const data = await response.json();
        
        // Mock data for now
        setOverview({
          revenue: { total: 125000, change: 12.5 },
          expenses: { total: 85000, change: -5.2 },
          netIncome: { total: 40000, change: 28.7 },
          cashFlow: { total: 35000, change: 15.3 }
        });
      } catch (error) {
        console.error('Error fetching financial overview:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOverview();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    badgeVariant 
  }: { 
    title: string; 
    value: number; 
    change: number; 
    icon: any; 
    badgeVariant: 'default' | 'destructive' | 'success';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(value)}</div>
        <div className="flex items-center pt-1">
          <Badge variant={change >= 0 ? "default" : "destructive"}>
            {change >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
            {Math.abs(change)}%
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">
            from last period
          </span>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Revenue" 
        value={overview.revenue.total} 
        change={overview.revenue.change} 
        icon={Wallet} 
        badgeVariant="default" 
      />
      <StatCard 
        title="Total Expenses" 
        value={overview.expenses.total} 
        change={overview.expenses.change} 
        icon={FileText} 
        badgeVariant="destructive" 
      />
      <StatCard 
        title="Net Income" 
        value={overview.netIncome.total} 
        change={overview.netIncome.change} 
        icon={PiggyBank} 
        badgeVariant={overview.netIncome.change >= 0 ? "default" : "destructive"} 
      />
      <StatCard 
        title="Cash Flow" 
        value={overview.cashFlow.total} 
        change={overview.cashFlow.change} 
        icon={ChartBar} 
        badgeVariant={overview.cashFlow.change >= 0 ? "default" : "destructive"} 
      />
    </div>
  );
}