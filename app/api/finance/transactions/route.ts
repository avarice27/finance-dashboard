import { NextResponse } from 'next/server';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransactionLines,
  createTransactionLine,
  updateTransactionLine,
  deleteTransactionLine
} from '@/db/queries';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await getTransactions(session.user.id);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { lines, ...transactionData } = data;
    
    // Create the transaction
    const newTransaction = await createTransaction({
      ...transactionData,
      userId: session.user.id
    });
    
    // Create transaction lines
    const transactionId = newTransaction[0].id;
    const createdLines = [];
    
    for (const line of lines) {
      const newLine = await createTransactionLine({
        ...line,
        transactionId
      });
      createdLines.push(newLine[0]);
    }
    
    return NextResponse.json({
      ...newTransaction[0],
      lines: createdLines
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, lines, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Update the transaction
    const updatedTransaction = await updateTransaction(id, updateData);
    
    // Update or create transaction lines
    const updatedLines = [];
    
    for (const line of lines) {
      let updatedLine;
      if (line.id) {
        // Update existing line
        const { id, ...lineData } = line;
        updatedLine = await updateTransactionLine(id, lineData);
      } else {
        // Create new line
        updatedLine = await createTransactionLine({
          ...line,
          transactionId: id
        });
      }
      updatedLines.push(updatedLine[0]);
    }
    
    return NextResponse.json({
      ...updatedTransaction[0],
      lines: updatedLines
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Delete transaction lines first (due to foreign key constraints)
    // Note: This would be handled by CASCADE delete in the schema
    
    const deletedTransaction = await deleteTransaction(parseInt(id));
    return NextResponse.json(deletedTransaction[0]);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}