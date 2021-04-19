-- CreateEnum
CREATE TYPE "Network" AS ENUM ('ETHEREUM', 'GOERLI', 'BSC', 'BSCT');

-- CreateTable
CREATE TABLE "Transaction" (
    "network" "Network" NOT NULL,
    "hash" TEXT NOT NULL,
    "transactionIndex" SMALLINT NOT NULL,
    "blockNumber" DECIMAL(65,20) NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "addressFrom" TEXT NOT NULL,
    "addressTo" TEXT NOT NULL,
    "value" DECIMAL(65,20) NOT NULL,
    "addressContract" TEXT NOT NULL,
    "tokenDecimals" SMALLINT NOT NULL,
    "gas" DECIMAL(65,20) NOT NULL,
    "gasPrice" DECIMAL(65,20) NOT NULL,
    "transactionOutNetwork" "Network",
    "transactionOutHash" TEXT,
    "transactionOutIndex" SMALLINT,

    PRIMARY KEY ("network","hash","transactionIndex")
);

-- CreateTable
CREATE TABLE "LiquidityProvider" (
    "address" TEXT NOT NULL,

    PRIMARY KEY ("address")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionOutNetwork_transactionOutHash_transactionOutIndex_unique" ON "Transaction"("transactionOutNetwork", "transactionOutHash", "transactionOutIndex");

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("transactionOutNetwork", "transactionOutHash", "transactionOutIndex") REFERENCES "Transaction"("network", "hash", "transactionIndex") ON DELETE SET NULL ON UPDATE CASCADE;
