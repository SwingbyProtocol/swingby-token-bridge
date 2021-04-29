-- CreateEnum
CREATE TYPE "Network" AS ENUM ('ETHEREUM', 'GOERLI', 'BSC', 'BSCT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "LiquidityProvider" (
    "address" TEXT NOT NULL,

    PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Deposit" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("network","hash")
);

-- CreateTable
CREATE TABLE "Payment" (
    "network" "Network" NOT NULL,
    "hash" TEXT NOT NULL,
    "signedTransaction" TEXT NOT NULL DEFAULT E'',
    "status" "PaymentStatus" NOT NULL DEFAULT E'PENDING',
    "transactionIndex" SMALLINT,
    "blockNumber" DECIMAL(65,20),
    "at" TIMESTAMP(3),
    "addressFrom" TEXT,
    "addressTo" TEXT,
    "value" DECIMAL(65,20),
    "addressContract" TEXT,
    "tokenDecimals" SMALLINT,
    "gas" DECIMAL(65,20),
    "gasPrice" DECIMAL(65,20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "depositNetwork" "Network" NOT NULL,
    "depositHash" TEXT NOT NULL,

    PRIMARY KEY ("network","hash")
);

-- CreateIndex
CREATE INDEX "Deposit.network_at_index" ON "Deposit"("network", "at");

-- CreateIndex
CREATE INDEX "Deposit.network_blockNumber_index" ON "Deposit"("network", "blockNumber");

-- CreateIndex
CREATE INDEX "Deposit.network_addressFrom_index" ON "Deposit"("network", "addressFrom");

-- CreateIndex
CREATE INDEX "Deposit.network_addressTo_index" ON "Deposit"("network", "addressTo");

-- CreateIndex
CREATE INDEX "Payment.network_at_index" ON "Payment"("network", "at");

-- CreateIndex
CREATE INDEX "Payment.network_blockNumber_index" ON "Payment"("network", "blockNumber");

-- CreateIndex
CREATE INDEX "Payment.network_addressFrom_index" ON "Payment"("network", "addressFrom");

-- CreateIndex
CREATE INDEX "Payment.network_addressTo_index" ON "Payment"("network", "addressTo");

-- CreateIndex
CREATE INDEX "Payment.network_status_index" ON "Payment"("network", "status");

-- CreateIndex
CREATE INDEX "Payment.network_depositNetwork_depositHash_index" ON "Payment"("network", "depositNetwork", "depositHash");

-- AddForeignKey
ALTER TABLE "Payment" ADD FOREIGN KEY ("depositNetwork", "depositHash") REFERENCES "Deposit"("network", "hash") ON DELETE CASCADE ON UPDATE CASCADE;
