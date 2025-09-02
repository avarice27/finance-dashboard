import { eq, and, gte, lte, desc, sum, sql } from "drizzle-orm";
import { db } from "../index";
import { 
  account, 
  transaction, 
  transactionLine, 
  budget,
  report
} from "./schema/finance";
import { user } from "./schema/auth";

// Account queries
export const getAccounts = async () => {
  return await db.select().from(account).orderBy(account.code);
};

export const getAccountById = async (id: number) => {
  return await db.select().from(account).where(eq(account.id, id));
};

export const createAccount = async (data: typeof account.$inferInsert) => {
  return await db.insert(account).values(data).returning();
};

export const updateAccount = async (id: number, data: Partial<typeof account.$inferInsert>) => {
  return await db.update(account).set(data).where(eq(account.id, id)).returning();
};

export const deleteAccount = async (id: number) => {
  return await db.delete(account).where(eq(account.id, id)).returning();
};

// Transaction queries
export const getTransactions = async (userId: string) => {
  return await db.select().from(transaction)
    .where(eq(transaction.userId, userId))
    .orderBy(desc(transaction.date));
};

export const getTransactionById = async (id: number) => {
  return await db.select().from(transaction).where(eq(transaction.id, id));
};

export const createTransaction = async (data: typeof transaction.$inferInsert) => {
  return await db.insert(transaction).values(data).returning();
};

export const updateTransaction = async (id: number, data: Partial<typeof transaction.$inferInsert>) => {
  return await db.update(transaction).set(data).where(eq(transaction.id, id)).returning();
};

export const deleteTransaction = async (id: number) => {
  return await db.delete(transaction).where(eq(transaction.id, id)).returning();
};

// Transaction Line queries
export const getTransactionLines = async (transactionId: number) => {
  return await db.select().from(transactionLine)
    .where(eq(transactionLine.transactionId, transactionId));
};

export const createTransactionLine = async (data: typeof transactionLine.$inferInsert) => {
  return await db.insert(transactionLine).values(data).returning();
};

export const updateTransactionLine = async (id: number, data: Partial<typeof transactionLine.$inferInsert>) => {
  return await db.update(transactionLine).set(data).where(eq(transactionLine.id, id)).returning();
};

export const deleteTransactionLine = async (id: number) => {
  return await db.delete(transactionLine).where(eq(transactionLine.id, id)).returning();
};

// Budget queries
export const getBudgets = async (userId: string) => {
  return await db.select().from(budget)
    .where(eq(budget.userId, userId))
    .orderBy(budget.name);
};

export const getBudgetById = async (id: number) => {
  return await db.select().from(budget).where(eq(budget.id, id));
};

export const createBudget = async (data: typeof budget.$inferInsert) => {
  return await db.insert(budget).values(data).returning();
};

export const updateBudget = async (id: number, data: Partial<typeof budget.$inferInsert>) => {
  return await db.update(budget).set(data).where(eq(budget.id, id)).returning();
};

export const deleteBudget = async (id: number) => {
  return await db.delete(budget).where(eq(budget.id, id)).returning();
};

// Report queries
export const getReports = async (userId: string) => {
  return await db.select().from(report)
    .where(eq(report.userId, userId))
    .orderBy(desc(report.createdAt));
};

export const getReportById = async (id: number) => {
  return await db.select().from(report).where(eq(report.id, id));
};

export const createReport = async (data: typeof report.$inferInsert) => {
  return await db.insert(report).values(data).returning();
};

export const updateReport = async (id: number, data: Partial<typeof report.$inferInsert>) => {
  return await db.update(report).set(data).where(eq(report.id, id)).returning();
};

export const deleteReport = async (id: number) => {
  return await db.delete(report).where(eq(report.id, id)).returning();
};

// Financial calculations
export const getAccountBalance = async (accountId: number) => {
  const result = await db
    .select({
      balance: sum(transactionLine.amount)
    })
    .from(transactionLine)
    .where(eq(transactionLine.accountId, accountId));
    
  return result[0]?.balance || "0";
};

export const getAccountTransactions = async (accountId: number, startDate?: Date, endDate?: Date) => {
  let query = db.select({
    id: transaction.id,
    date: transaction.date,
    description: transaction.description,
    amount: transactionLine.amount
  })
  .from(transactionLine)
  .innerJoin(transaction, eq(transactionLine.transactionId, transaction.id))
  .where(eq(transactionLine.accountId, accountId));
  
  if (startDate) {
    query = query.where(gte(transaction.date, startDate));
  }
  
  if (endDate) {
    query = query.where(lte(transaction.date, endDate));
  }
  
  return await query.orderBy(transaction.date);
};

export const getFinancialOverview = async (userId: string, startDate: Date, endDate: Date) => {
  // Revenue accounts
  const revenueAccounts = await db.select({
    id: account.id,
    name: account.name,
    total: sql<number>`SUM(${transactionLine.amount})`.mapWith(Number)
  })
  .from(account)
  .innerJoin(transactionLine, eq(account.id, transactionLine.accountId))
  .innerJoin(transaction, eq(transactionLine.transactionId, transaction.id))
  .where(and(
    eq(account.type, "revenue"),
    eq(transaction.userId, userId),
    gte(transaction.date, startDate),
    lte(transaction.date, endDate)
  ))
  .groupBy(account.id, account.name);
  
  // Expense accounts
  const expenseAccounts = await db.select({
    id: account.id,
    name: account.name,
    total: sql<number>`SUM(${transactionLine.amount})`.mapWith(Number)
  })
  .from(account)
  .innerJoin(transactionLine, eq(account.id, transactionLine.accountId))
  .innerJoin(transaction, eq(transactionLine.transactionId, transaction.id))
  .where(and(
    eq(account.type, "expense"),
    eq(transaction.userId, userId),
    gte(transaction.date, startDate),
    lte(transaction.date, endDate)
  ))
  .groupBy(account.id, account.name);
  
  // Calculate totals
  const totalRevenue = revenueAccounts.reduce((sum, account) => sum + account.total, 0);
  const totalExpenses = expenseAccounts.reduce((sum, account) => sum + account.total, 0);
  const netIncome = totalRevenue - totalExpenses;
  
  return {
    revenue: {
      accounts: revenueAccounts,
      total: totalRevenue
    },
    expenses: {
      accounts: expenseAccounts,
      total: totalExpenses
    },
    netIncome
  };
};