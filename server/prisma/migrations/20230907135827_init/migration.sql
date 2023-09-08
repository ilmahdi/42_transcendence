-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('WAITING', 'REFUSED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PLAING', 'WAITING', 'ENDED');

-- CreateEnum
CREATE TYPE "ChannelTypes" AS ENUM ('MONO', 'MULTI');

-- CreateEnum
CREATE TYPE "AccessTypes" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- CreateEnum
CREATE TYPE "AccessLevels" AS ENUM ('NORMAL', 'BANNED', 'MUTED');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "socketId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "imagePath" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "readed" BOOLEAN NOT NULL DEFAULT false,
    "roomId" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "name" TEXT NOT NULL DEFAULT 'Room',
    "usersId" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "type" "RoomType" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "imagePath" TEXT NOT NULL DEFAULT 'default.png',

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
