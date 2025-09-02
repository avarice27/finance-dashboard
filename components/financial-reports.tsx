'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function FinancialReports() {
  const [reportType, setReportType] = useState('revenue');
  const [data, setData] = useState<any[]>([]);

  // Mock data - in a real app, this would come from API
  const revenueData = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 1800 },
    { month: 'Apr', revenue: 2780, expenses: 2000 },
    { month: 'May', revenue: 1890, expenses: 1500 },
    { month: 'Jun', revenue: 2390, expenses: 1900 },
  ];

  const expenseData = [
    { name: 'Office', value: 400 },
    { name: 'Marketing', value: 300 },
    { name: 'Salaries', value: 700 },
    { name: 'Software', value: 200 },
    { name: 'Travel', value: 100 },
  ];

  useEffect(() => {
    // In a real app, this would fetch from our API based on reportType
    if (reportType === 'revenue') {
      setData(revenueData);
    } else if (reportType === 'expenses') {
      setData(expenseData);
    }
  }, [reportType]);

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select report" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue vs Expenses</SelectItem>
            <SelectItem value="expenses">Expense Breakdown</SelectItem>
            <SelectItem value="cashflow">Cash Flow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {reportType === 'revenue' && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                  <Bar dataKey="expenses" fill="#00C49F" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {reportType === 'expenses' && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {reportType === 'cashflow' && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Cash Flow Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Inflow" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Outflow" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}