import { pgTable, serial, text, integer, decimal, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Chart of Accounts
export const account = pgTable("account", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: text("type", { 
    enum: ["asset", "liability", "equity", "revenue", "expense"] 
  }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Financial Transactions
export const transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  reference: text("reference"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transaction Line Items
export const transactionLine = pgTable("transaction_line", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id")
    .notNull()
    .references(() => transaction.id, { onDelete: "cascade" }),
  accountId: integer("account_id")
    .notNull()
    .references(() => account.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(), // Positive for debit, negative for credit
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Budget Categories
export const budget = pgTable("budget", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  accountId: integer("account_id")
    .notNull()
    .references(() => account.id, { onDelete: "cascade" }),
  allocated: decimal("allocated", { precision: 15, scale: 2 }).notNull(),
  period: text("period").notNull(), // e.g., "2023-01", "2023-Q1"
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Financial Reports
export const report = pgTable("report", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { 
    enum: ["income_statement", "balance_sheet", "cash_flow"] 
  }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  data: text("data"), // JSON data for the report
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});