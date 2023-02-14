/*
  Warnings:

  - Made the column `bio` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "bio" SET DEFAULT 'A Socialko user';
