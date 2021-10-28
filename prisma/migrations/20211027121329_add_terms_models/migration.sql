-- CreateTable
CREATE TABLE "TermsAgreementMessage" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermsAgreementLog" (
    "address" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("address","messageId")
);

-- AddForeignKey
ALTER TABLE "TermsAgreementLog" ADD FOREIGN KEY ("messageId") REFERENCES "TermsAgreementMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
