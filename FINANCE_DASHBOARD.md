# Finance Dashboard Application

This is a comprehensive finance dashboard application built with Next.js, Drizzle ORM, and PostgreSQL.

## Features

1. **Financial Overview**
   - Revenue, expenses, and net income tracking
   - Visual indicators for financial health

2. **Chart of Accounts**
   - Manage account codes, names, and types
   - Support for assets, liabilities, equity, revenue, and expenses

3. **Transaction Management**
   - Record financial transactions with dates and descriptions
   - Track references for audit purposes

4. **Budget Tracking**
   - Set budgets for different categories
   - Monitor spending against allocated amounts
   - Visual progress indicators

5. **Financial Reporting**
   - Revenue vs expenses visualization
   - Expense breakdown charts
   - Cash flow trend analysis

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **UI Components**: Radix UI, Shadcn UI
- **Charts**: Recharts

## Database Schema

The application uses the following database tables:

1. `account` - Chart of accounts
2. `transaction` - Financial transactions
3. `transaction_line` - Transaction line items
4. `budget` - Budget categories and allocations
5. `report` - Generated financial reports

## API Endpoints

- `/api/finance/accounts` - Manage chart of accounts
- `/api/finance/transactions` - Manage financial transactions
- `/api/finance/budgets` - Manage budgets
- `/api/finance/reports` - Generate and manage reports

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Run database migrations: `npm run db:push`
5. Start the development server: `npm run dev`

## Development

- To generate new migrations: `npm run db:generate`
- To push schema changes: `npm run db:push`
- To start database locally: `npm run db:dev`