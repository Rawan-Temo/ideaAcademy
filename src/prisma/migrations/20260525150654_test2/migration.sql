/*
  Warnings:

  - Added the required column `Video` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` ADD COLUMN `Video` VARCHAR(255) NULL,
    ADD COLUMN `image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `Video` VARCHAR(255) NOT NULL,
    ADD COLUMN `image` VARCHAR(255) NOT NULL,
    MODIFY `title` VARCHAR(191) NULL,
    MODIFY `content` VARCHAR(191) NULL;
