/*
  Warnings:

  - You are about to alter the column `visibility` on the `event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `event_invitation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `visibility` ENUM('PUBLIC', 'PRIVATE', 'FRIENDS') NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE `event_invitation` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING';
