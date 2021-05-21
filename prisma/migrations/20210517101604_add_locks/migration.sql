-- CreateEnum
CREATE TYPE "LockId" AS ENUM ('PAYMENTS_SCRIPT');

-- CreateTable
CREATE TABLE "Locks" (
    "id" "LockId" NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
