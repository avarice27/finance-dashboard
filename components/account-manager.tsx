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

type Account = {
  id: number;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  description?: string;
};

export function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'asset' as 'asset' | 'liability' | 'equity' | 'revenue' | 'expense',
    description: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // In a real app, this would fetch from our API
      // const response = await fetch('/api/finance/accounts');
      // const data = await response.json();
      
      // Mock data for now
      setAccounts([
        { id: 1, code: '1000', name: 'Cash', type: 'asset' },
        { id: 2, code: '1200', name: 'Accounts Receivable', type: 'asset' },
        { id: 3, code: '4000', name: 'Sales Revenue', type: 'revenue' },
        { id: 4, code: '5000', name: 'Cost of Goods Sold', type: 'expense' },
        { id: 5, code: '2000', name: 'Accounts Payable', type: 'liability' }
      ]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      // In a real app, this would POST to our API
      // const response = await fetch('/api/finance/accounts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const newAccount = await response.json();
      
      // Mock implementation
      const newAccount = {
        id: accounts.length + 1,
        ...formData
      };
      
      setAccounts([...accounts, newAccount]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;
    
    try {
      // In a real app, this would PUT to our API
      // const response = await fetch(`/api/finance/accounts`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id: editingAccount.id, ...formData })
      // });
      // const updatedAccount = await response.json();
      
      // Mock implementation
      const updatedAccounts = accounts.map(acc => 
        acc.id === editingAccount.id ? { ...acc, ...formData } : acc
      );
      
      setAccounts(updatedAccounts);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      // In a real app, this would DELETE to our API
      // await fetch(`/api/finance/accounts?id=${id}`, { method: 'DELETE' });
      
      // Mock implementation
      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'asset',
      description: ''
    });
    setEditingAccount(null);
  };

  const openEditDialog = (account: Account) => {
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      description: account.description || ''
    });
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      handleUpdateAccount();
    } else {
      handleCreateAccount();
    }
  };

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chart of Accounts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? 'Edit Account' : 'Create Account'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount 
                  ? 'Edit the account details below' 
                  : 'Add a new account to your chart of accounts'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="col-span-3"
                  />
                </div>
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
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
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
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingAccount ? 'Update Account' : 'Create Account'}
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>
                  <span className="capitalize">{account.type}</span>
                </TableCell>
                <TableCell>{account.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(account)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
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