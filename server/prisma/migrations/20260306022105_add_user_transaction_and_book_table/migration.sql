/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `identifier` VARCHAR(191) NOT NULL,
    ADD COLUMN `isResetPending` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pendingNewPassword` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookCode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `publisher` VARCHAR(191) NULL,
    `coverImage` VARCHAR(191) NULL,
    `synopsis` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Book_bookCode_key`(`bookCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,
    `status` ENUM('PENDING_BORROW', 'BORROWED', 'PENDING_RETURN', 'RETURNED', 'REJECTED') NOT NULL DEFAULT 'PENDING_BORROW',
    `borrowDate` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,
    `returnDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_identifier_key` ON `User`(`identifier`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
