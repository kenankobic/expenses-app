/*
  Warnings:

  - Added the required column `note` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "subType" DROP NOT NULL,
ALTER COLUMN "forPerson" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "note" TEXT NOT NULL;
