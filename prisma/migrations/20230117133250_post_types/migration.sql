-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Text', 'Image');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'Image';
