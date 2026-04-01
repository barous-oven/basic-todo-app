/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `task_tag` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `task_tag` table. All the data in the column will be lost.
  - Added the required column `tag_id` to the `task_tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_id` to the `task_tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task_tag" DROP CONSTRAINT "task_tag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "task_tag" DROP CONSTRAINT "task_tag_taskId_fkey";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "task_tag" DROP COLUMN "tagId",
DROP COLUMN "taskId",
ADD COLUMN     "tag_id" TEXT NOT NULL,
ADD COLUMN     "task_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task_tag" ADD CONSTRAINT "task_tag_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_tag" ADD CONSTRAINT "task_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
