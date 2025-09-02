'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Budget = {
  id: number;
  name: string;
  accountId: number;
  accountName: string;
  allocated: number;
  spent: number;
  period: string;
};

export function BudgetTracker() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    accountId: 0,
    allocated: '',
    period: '2023-01'
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      // In a real app, this would fetch from our API
      // const response = await fetch('/api/finance/budgets');
      // const data = await response.json();
      
      // Mock data for now
      setBudgets([
        { 
          id: 1, 
          name: 'Office Supplies', 
          accountId: 1, 
          accountName: 'Office Expenses',
          allocated: 500, 
          spent: 250, 
          period: '2023-05' 
        },
        { 
          id: 2, 
          name: 'Marketing', 
          accountId: 2, 
          accountName: 'Marketing Expenses',
          allocated: 2000, 
          spent: 1850, 
          period: '2023-05' 
        },
        { 
          id: 3, 
          name: 'Travel', 
          accountId: 3, 
          accountName: 'Travel Expenses',
          allocated: 1500, 
          spent: 750, 
          period: '2023-05' 
        },
        { 
          id: 4, 
          name: 'Software', 
          accountId: 4, 
          accountName: 'Software Expenses',
          allocated: 1000, 
          spent: 99, 
          period: '2023-05' 
        }
      ]);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    try {
      // In a real app, this would POST to our API
      // const response = await fetch('/api/finance/budgets', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     allocated: parseFloat(formData.allocated)
      //   })
      // });
      // const newBudget = await response.json();
      
      // Mock implementation
      const newBudget = {
        id: budgets.length + 1,
        ...formData,
        allocated: parseFloat(formData.allocated),
        spent: 0,
        accountName: 'Office Expenses' // Mock account name
      } as Budget;
      
      setBudgets([...budgets, newBudget]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleUpdateBudget = async () => {
    if (!editingBudget) return;
    
    try {
      // In a real app, this would PUT to our API
      // const response = await fetch(`/api/finance/budgets`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     id: editingBudget.id, 
      //     ...formData,
      //     allocated: parseFloat(formData.allocated)
      //   })
      // });
      // const updatedBudget = await response.json();
      
      // Mock implementation
      const updatedBudgets = budgets.map(b => 
        b.id === editingBudget.id 
          ? { ...b, ...formData, allocated: parseFloat(formData.allocated) } 
          : b
      );
      
      setBudgets(updatedBudgets);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      // In a real app, this would DELETE to our API
      // await fetch(`/api/finance/budgets?id=${id}`, { method: 'DELETE' });
      
      // Mock implementation
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      accountId: 0,
      allocated: '',
      period: '2023-01'
    });
    setEditingBudget(null);
  };

  const openEditDialog = (budget: Budget) => {
    setFormData({
      name: budget.name,
      accountId: budget.accountId,
      allocated: budget.allocated.toString(),
      period: budget.period
    });
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget) {
      handleUpdateBudget();
    } else {
      handleCreateBudget();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculatePercentage = (spent: number, allocated: number) => {
    return Math.min(100, Math.round((spent / allocated) * 100));
  };

  if (loading) {
    return <div>Loading budgets...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Tracking</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget 
                  ? 'Edit the budget details below' 
                  : 'Add a new budget category'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="allocated" className="text-right">
                    Allocated
                  </Label>
                  <Input
                    id="allocated"
                    type="number"
                    step="0.01"
                    value={formData.allocated}
                    onChange={(e) => setFormData({...formData, allocated: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="period" className="text-right">
                    Period
                  </Label>
                  <Input
                    id="period"
                    type="month"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Allocated</TableHead>
              <TableHead className="text-right">Spent</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => {
              const percentage = calculatePercentage(budget.spent, budget.allocated);
              const remaining = budget.allocated - budget.spent;
              
              return (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.name}</TableCell>
                  <TableCell>{budget.accountName}</TableCell>
                  <TableCell>{budget.period}</TableCell>
                  <TableCell className="text-right">{formatCurrency(budget.allocated)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(budget.spent)}</TableCell>
                  <TableCell className={`text-right ${remaining < 0 ? 'text-red-600' : ''}`}>
                    {formatCurrency(remaining)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={percentage} 
                        className={percentage > 90 ? 'text-red-600' : percentage > 75 ? 'text-yellow-600' : ''}
                      />
                      <span className="text-xs w-10">{percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(budget)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}