/*
  Warnings:

  - You are about to drop the column `followerId` on the `relation` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `relation` table. All the data in the column will be lost.
  - Added the required column `follower_id` to the `relation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `following_id` to the `relation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `relation` DROP FOREIGN KEY `relation_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `relation` DROP FOREIGN KEY `relation_followingId_fkey`;

-- DropIndex
DROP INDEX `relation_followerId_fkey` ON `relation`;

-- DropIndex
DROP INDEX `relation_followingId_fkey` ON `relation`;

-- AlterTable
ALTER TABLE `relation` DROP COLUMN `followerId`,
    DROP COLUMN `followingId`,
    ADD COLUMN `follower_id` INTEGER NOT NULL,
    ADD COLUMN `following_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `relation` ADD CONSTRAINT `relation_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relation` ADD CONSTRAINT `relation_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
