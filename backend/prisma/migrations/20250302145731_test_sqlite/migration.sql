-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "follow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "followed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sport" TEXT NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "planned_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participant_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "canInvite" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_participant_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_message_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_invitation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_id" INTEGER NOT NULL,
    "inviter_id" INTEGER NOT NULL,
    "invitee_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" DATETIME NOT NULL,
    CONSTRAINT "event_invitation_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_invitation_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_invitation_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudo_key" ON "user"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "follow_follower_id_following_id_key" ON "follow"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_participant_participant_id_event_id_key" ON "event_participant"("participant_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_invitation_event_id_invitee_id_key" ON "event_invitation"("event_id", "invitee_id");
