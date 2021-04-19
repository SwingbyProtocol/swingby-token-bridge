-- CreateEnum
CREATE TYPE "Network" AS ENUM ('ETHEREUM', 'GOERLI', 'BSC', 'BSCT');

-- CreateTable
CREATE TABLE "Transaction" (
    "network" "Network" NOT NULL,
    "hash" TEXT NOT NULL,
    "transactionIndex" SMALLINT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "addressFrom" TEXT NOT NULL,
    "addressTo" TEXT NOT NULL,
    "value" DECIMAL(65,18) NOT NULL,
    "addressContract" TEXT NOT NULL,
    "tokenDecimals" SMALLINT NOT NULL,
    "gas" BIGINT NOT NULL,
    "gasPrice" DECIMAL(65,18) NOT NULL,
    "transactionOutNetwork" "Network",
    "transactionOutHash" TEXT,
    "transactionOutIndex" SMALLINT,

    PRIMARY KEY ("network","hash","transactionIndex")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionOutNetwork_transactionOutHash_transactionOutIndex_unique" ON "Transaction"("transactionOutNetwork", "transactionOutHash", "transactionOutIndex");

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("transactionOutNetwork", "transactionOutHash", "transactionOutIndex") REFERENCES "Transaction"("network", "hash", "transactionIndex") ON DELETE SET NULL ON UPDATE CASCADE;
