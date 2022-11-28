/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PrivateFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PublicFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Story` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_downvote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_upvote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `follow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_profilePictureId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_imageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileId_fkey";

-- DropForeignKey
ALTER TABLE "follow" DROP CONSTRAINT "follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "follow" DROP CONSTRAINT "follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "post_downvote" DROP CONSTRAINT "post_downvote_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_downvote" DROP CONSTRAINT "post_downvote_profileId_fkey";

-- DropForeignKey
ALTER TABLE "post_upvote" DROP CONSTRAINT "post_upvote_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_upvote" DROP CONSTRAINT "post_upvote_profile_id_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "imageId" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "PrivateFile" DROP CONSTRAINT "PrivateFile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PrivateFile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PrivateFile_id_seq";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "profilePictureId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Profile_id_seq";

-- AlterTable
ALTER TABLE "PublicFile" DROP CONSTRAINT "PublicFile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PublicFile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PublicFile_id_seq";

-- AlterTable
ALTER TABLE "Story" DROP CONSTRAINT "Story_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "imageId" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Story_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Story_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "profileId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "post_downvote" DROP CONSTRAINT "post_downvote_pkey",
ALTER COLUMN "profileId" SET DATA TYPE TEXT,
ALTER COLUMN "postId" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_downvote_pkey" PRIMARY KEY ("profileId", "postId");

-- AlterTable
ALTER TABLE "post_upvote" DROP CONSTRAINT "post_upvote_pkey",
ALTER COLUMN "profile_id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_upvote_pkey" PRIMARY KEY ("profile_id", "post_id");

-- DropTable
DROP TABLE "follow";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "PublicFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "PublicFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_upvote" ADD CONSTRAINT "post_upvote_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_upvote" ADD CONSTRAINT "post_upvote_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_downvote" ADD CONSTRAINT "post_downvote_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_downvote" ADD CONSTRAINT "post_downvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "PublicFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
