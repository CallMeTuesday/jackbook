CREATE TABLE "SavedVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moveId" TEXT NOT NULL,
    "moveName" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoThumb" TEXT NOT NULL,
    "channelTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedVideo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SavedVideo_userId_videoId_moveId_key" ON "SavedVideo"("userId", "videoId", "moveId");

ALTER TABLE "SavedVideo" ADD CONSTRAINT "SavedVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
