-- CreateTable
CREATE TABLE "VideoCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moveId" TEXT NOT NULL,
    "videos" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VideoCache_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoCache_moveId_key" ON "VideoCache"("moveId");
