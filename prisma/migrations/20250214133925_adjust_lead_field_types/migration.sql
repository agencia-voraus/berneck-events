/*
  Warnings:

  - You are about to alter the column `fullName` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `jobTitle` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `zipCode` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(8)`.
  - You are about to alter the column `street` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `number` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `complement` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `state` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(2)`.
  - You are about to alter the column `city` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "jobTitle" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "zipCode" SET DATA TYPE CHAR(8),
ALTER COLUMN "street" SET DATA TYPE VARCHAR(255),
DROP COLUMN "number",
ADD COLUMN     "number" INTEGER,
ALTER COLUMN "complement" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "state" SET DATA TYPE CHAR(2),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(255);
