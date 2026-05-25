/*
  Warnings:

  - You are about to drop the column `Video` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `Video` on the `Post` table. All the data in the column will be lost.
  - Added the required column `video` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` DROP COLUMN `Video`,
    ADD COLUMN `video` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `Video`,
    ADD COLUMN `video` VARCHAR(255) NOT NULL;
