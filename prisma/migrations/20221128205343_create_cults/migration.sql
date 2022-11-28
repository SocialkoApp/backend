/*
  Warnings:

  - The values [USER,EDITOR,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CultRole" AS ENUM ('Ruler', 'Member');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('User', 'Admin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';

-- CreateTable
CREATE TABLE "cult_membership" (
    "role" "CultRole" NOT NULL DEFAULT 'Member',
    "memberId" TEXT NOT NULL,
    "cultId" TEXT NOT NULL,

    CONSTRAINT "cult_membership_pkey" PRIMARY KEY ("cultId","memberId")
);

-- CreateTable
CREATE TABLE "Cult" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cult_name_key" ON "Cult"("name");

-- AddForeignKey
ALTER TABLE "cult_membership" ADD CONSTRAINT "cult_membership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cult_membership" ADD CONSTRAINT "cult_membership_cultId_fkey" FOREIGN KEY ("cultId") REFERENCES "Cult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cult" ADD CONSTRAINT "Cult_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "PublicFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
