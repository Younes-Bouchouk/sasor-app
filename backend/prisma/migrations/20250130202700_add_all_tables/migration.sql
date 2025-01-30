-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizer_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `sport` VARCHAR(191) NOT NULL,
    `max_participants` INTEGER NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `private` BOOLEAN NOT NULL,
    `planned_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `participant_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_participant_participant_id_event_id_key`(`participant_id`, `event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `sent_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `inviter_id` INTEGER NOT NULL,
    `invitee_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `sent_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `responded_at` DATETIME(3) NULL,

    UNIQUE INDEX `event_invitation_event_id_invitee_id_key`(`event_id`, `invitee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_organizer_id_fkey` FOREIGN KEY (`organizer_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_participant` ADD CONSTRAINT `event_participant_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_participant` ADD CONSTRAINT `event_participant_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_message` ADD CONSTRAINT `event_message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_message` ADD CONSTRAINT `event_message_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_invitation` ADD CONSTRAINT `event_invitation_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_invitation` ADD CONSTRAINT `event_invitation_inviter_id_fkey` FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_invitation` ADD CONSTRAINT `event_invitation_invitee_id_fkey` FOREIGN KEY (`invitee_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
