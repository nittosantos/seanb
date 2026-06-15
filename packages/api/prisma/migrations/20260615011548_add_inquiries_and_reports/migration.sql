-- CreateEnum
CREATE TYPE "ListingReportReason" AS ENUM ('INACCURATE', 'NOT_REAL_PLACE', 'SCAM', 'OFFENSIVE', 'OTHER');

-- CreateTable
CREATE TABLE "HostInquiry" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingReport" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,
    "reason" "ListingReportReason" NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HostInquiry_listingId_idx" ON "HostInquiry"("listingId");

-- CreateIndex
CREATE INDEX "HostInquiry_userId_idx" ON "HostInquiry"("userId");

-- CreateIndex
CREATE INDEX "ListingReport_listingId_idx" ON "ListingReport"("listingId");

-- CreateIndex
CREATE INDEX "ListingReport_userId_idx" ON "ListingReport"("userId");

-- AddForeignKey
ALTER TABLE "HostInquiry" ADD CONSTRAINT "HostInquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostInquiry" ADD CONSTRAINT "HostInquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReport" ADD CONSTRAINT "ListingReport_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReport" ADD CONSTRAINT "ListingReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
