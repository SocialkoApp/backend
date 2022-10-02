-- CreateTable
CREATE TABLE "follow" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
