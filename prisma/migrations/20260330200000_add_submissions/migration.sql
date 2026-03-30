-- AlterTable: add username and profilePublic to User
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "profilePublic" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex: username must be unique
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateTable: Submission
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moveId" TEXT,
    "moveName" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE SET NULL ON UPDATE CASCADE;
