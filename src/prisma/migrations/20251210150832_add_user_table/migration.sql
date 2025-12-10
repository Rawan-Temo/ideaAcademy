-- AlterTable
ALTER TABLE `user` MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropIndex
DROP INDEX `user_id_key` ON `user`;
