-- CreateEnum
CREATE TYPE "PaymentCrashReason" AS ENUM ('UNKNOWN', 'FEES_HIGHER_THAN_AMOUNT');

-- CreateTable
CREATE TABLE "PaymentCrash" (
    "id" SERIAL NOT NULL,
    "reason" "PaymentCrashReason" NOT NULL DEFAULT E'UNKNOWN',
    "depositNetwork" "Network" NOT NULL,
    "depositHash" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentCrash" ADD FOREIGN KEY ("depositNetwork", "depositHash") REFERENCES "Deposit"("network", "hash") ON DELETE CASCADE ON UPDATE CASCADE;
