/*
  Warnings:

  - You are about to drop the column `genreId` on the `book` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_genreId_fkey`;

-- DropIndex
DROP INDEX `Book_genreId_fkey` ON `book`;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `genreId`;

-- CreateTable
CREATE TABLE `_BookToGenre` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookToGenre_AB_unique`(`A`, `B`),
    INDEX `_BookToGenre_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_B_fkey` FOREIGN KEY (`B`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
