/*
  Warnings:

  - A unique constraint covering the columns `[follower_id,following_id]` on the table `relation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `relation` ADD COLUMN `followed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `relation_follower_id_following_id_key` ON `relation`(`follower_id`, `following_id`);
