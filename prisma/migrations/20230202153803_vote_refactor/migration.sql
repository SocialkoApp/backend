/*
  Warnings:

  - You are about to drop the `post_upvote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `post_downvote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('Upvote', 'Downvote');

-- DropForeignKey
ALTER TABLE "post_upvote" DROP CONSTRAINT "post_upvote_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_upvote" DROP CONSTRAINT "post_upvote_profile_id_fkey";

-- AlterTable
ALTER TABLE "post_downvote" ADD COLUMN     "type" "VoteType" NOT NULL;

-- DropTable
DROP TABLE "post_upvote";
