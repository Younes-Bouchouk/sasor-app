/*
  Warnings:

  - You are about to drop the column `private` on the `event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pseudo]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `private`,
    ADD COLUMN `visibility` VARCHAR(191) NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE UNIQUE INDEX `user_pseudo_key` ON `user`(`pseudo`);
