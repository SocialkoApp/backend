/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Story` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId]` on the table `cult_membership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- CreateIndex
CREATE UNIQUE INDEX "cult_membership_memberId_key" ON "cult_membership"("memberId");
