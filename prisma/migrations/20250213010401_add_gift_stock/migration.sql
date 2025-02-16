-- CreateTable
CREATE TABLE "GiftStock" (
    "id" TEXT NOT NULL,
    "totalAvailable" INTEGER NOT NULL,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftStock_pkey" PRIMARY KEY ("id")
);
