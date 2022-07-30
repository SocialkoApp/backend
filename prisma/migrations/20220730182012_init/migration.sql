/*
  Warnings:

  - You are about to drop the column `publicFileId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_publicFileId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "publicFileId",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "profilePictureId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "PublicFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
