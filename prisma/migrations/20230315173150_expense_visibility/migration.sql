-- CreateEnum
CREATE TYPE "ExpenseVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "visibility" "ExpenseVisibility" NOT NULL DEFAULT 'PUBLIC';
