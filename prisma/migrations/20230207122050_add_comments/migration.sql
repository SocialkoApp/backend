/*
  Warnings:

  - You are about to drop the `post_downvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_downvote" DROP CONSTRAINT "post_downvote_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_downvote" DROP CONSTRAINT "post_downvote_profileId_fkey";

-- DropTable
DROP TABLE "post_downvote";

-- CreateTable
CREATE TABLE "post_vote" (
    "profileId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,

    CONSTRAINT "post_vote_pkey" PRIMARY KEY ("profileId","postId")
);

-- CreateTable
CREATE TABLE "post_comment" (
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "post_comment_pkey" PRIMARY KEY ("authorId","postId")
);

-- AddForeignKey
ALTER TABLE "post_vote" ADD CONSTRAINT "post_vote_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_vote" ADD CONSTRAINT "post_vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
