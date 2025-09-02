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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

type Transaction = {
  id: number;
  date: string;
  description: string;
  reference?: string;
  amount: number;
};

export function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    reference: '',
    amount: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // In a real app, this would fetch from our API
      // const response = await fetch('/api/finance/transactions');
      // const data = await response.json();
      
      // Mock data for now
      setTransactions([
        { id: 1, date: '2023-05-15', description: 'Office Supplies', amount: -250 },
        { id: 2, date: '2023-05-10', description: 'Client Payment', amount: 1500 },
        { id: 3, date: '2023-05-05', description: 'Software Subscription', amount: -99 },
        { id: 4, date: '2023-05-01', description: 'Monthly Salary', amount: -5000 },
        { id: 5, date: '2023-04-28', description: 'Project Invoice', amount: 2500 }
      ]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async () => {
    try {
      // In a real app, this would POST to our API
      // const response = await fetch('/api/finance/transactions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     amount: parseFloat(formData.amount)
      //   })
      // });
      // const newTransaction = await response.json();
      
      // Mock implementation
      const newTransaction = {
        id: transactions.length + 1,
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      setTransactions([newTransaction, ...transactions]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction) return;
    
    try {
      // In a real app, this would PUT to our API
      // const response = await fetch(`/api/finance/transactions`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     id: editingTransaction.id, 
      //     ...formData,
      //     amount: parseFloat(formData.amount)
      //   })
      // });
      // const updatedTransaction = await response.json();
      
      // Mock implementation
      const updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id 
          ? { ...t, ...formData, amount: parseFloat(formData.amount) } 
          : t
      );
      
      setTransactions(updatedTransactions);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      // In a real app, this would DELETE to our API
      // await fetch(`/api/finance/transactions?id=${id}`, { method: 'DELETE' });
      
      // Mock implementation
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      reference: '',
      amount: ''
    });
    setEditingTransaction(null);
  };

  const openEditDialog = (transaction: Transaction) => {
    setFormData({
      date: transaction.date,
      description: transaction.description,
      reference: transaction.reference || '',
      amount: transaction.amount.toString()
    });
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransaction) {
      handleUpdateTransaction();
    } else {
      handleCreateTransaction();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Transaction' : 'Create Transaction'}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction 
                  ? 'Edit the transaction details below' 
                  : 'Add a new transaction'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reference" className="text-right">
                    Reference
                  </Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingTransaction ? 'Update Transaction' : 'Create Transaction'}
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
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell className={`text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(transaction)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}