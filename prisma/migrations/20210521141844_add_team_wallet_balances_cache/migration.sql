-- CreateTable
CREATE TABLE "TeamWalletBalances" (
    "network" "Network" NOT NULL,
    "address" TEXT NOT NULL,
    "balance" DECIMAL(65,20) NOT NULL,

    PRIMARY KEY ("network","address")
);
