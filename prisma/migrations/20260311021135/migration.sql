/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskGroup" DROP CONSTRAINT "TaskGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "TaskGroup" DROP CONSTRAINT "TaskGroup_taskId_fkey";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "GroupMember";

-- DropTable
DROP TABLE "TaskGroup";
