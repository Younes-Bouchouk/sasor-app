/*
  Warnings:

  - You are about to drop the `relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `relation` DROP FOREIGN KEY `relation_follower_id_fkey`;

-- DropForeignKey
ALTER TABLE `relation` DROP FOREIGN KEY `relation_following_id_fkey`;

-- DropTable
DROP TABLE `relation`;

-- CreateTable
CREATE TABLE `follow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `follower_id` INTEGER NOT NULL,
    `following_id` INTEGER NOT NULL,
    `followed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `follow_follower_id_following_id_key`(`follower_id`, `following_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `follow` ADD CONSTRAINT `follow_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follow` ADD CONSTRAINT `follow_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
