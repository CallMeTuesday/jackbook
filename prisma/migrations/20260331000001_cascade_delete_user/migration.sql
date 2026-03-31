ALTER TABLE "SavedVideo" DROP CONSTRAINT "SavedVideo_userId_fkey";
ALTER TABLE "SavedVideo" ADD CONSTRAINT "SavedVideo_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
