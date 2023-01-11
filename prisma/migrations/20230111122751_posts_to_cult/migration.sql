/*
  Warnings:

  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_imageId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "cultId" TEXT;

-- DropTable
DROP TABLE "Story";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_cultId_fkey" FOREIGN KEY ("cultId") REFERENCES "Cult"("id") ON DELETE SET NULL ON UPDATE CASCADE;
