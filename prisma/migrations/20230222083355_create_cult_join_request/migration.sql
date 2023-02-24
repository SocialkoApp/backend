-- CreateTable
CREATE TABLE "cult_join_request" (
    "cultId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cult_join_request_pkey" PRIMARY KEY ("cultId","profileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "cult_join_request_profileId_key" ON "cult_join_request"("profileId");

-- AddForeignKey
ALTER TABLE "cult_join_request" ADD CONSTRAINT "cult_join_request_cultId_fkey" FOREIGN KEY ("cultId") REFERENCES "Cult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cult_join_request" ADD CONSTRAINT "cult_join_request_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
