-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar" TEXT,
    "auth_provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Emotion" (
    "emotionID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Emotion_pkey" PRIMARY KEY ("emotionID")
);

-- CreateTable
CREATE TABLE "Memory" (
    "memoryID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "emotionID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("memoryID")
);

-- CreateTable
CREATE TABLE "Media" (
    "mediaID" TEXT NOT NULL,
    "memoryID" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT,
    "upload_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("mediaID")
);

-- CreateTable
CREATE TABLE "ShareLink" (
    "shareID" TEXT NOT NULL,
    "memoryID" TEXT NOT NULL,
    "access_level" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "url" TEXT NOT NULL,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("shareID")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "reminderID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("reminderID")
);

-- CreateTable
CREATE TABLE "Report" (
    "reportID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "summary_text" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("reportID")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagID" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagID")
);

-- CreateTable
CREATE TABLE "MemoryTag" (
    "memoryID" TEXT NOT NULL,
    "tagID" TEXT NOT NULL,

    CONSTRAINT "MemoryTag_pkey" PRIMARY KEY ("memoryID","tagID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_emotionID_fkey" FOREIGN KEY ("emotionID") REFERENCES "Emotion"("emotionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_memoryID_fkey" FOREIGN KEY ("memoryID") REFERENCES "Memory"("memoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_memoryID_fkey" FOREIGN KEY ("memoryID") REFERENCES "Memory"("memoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryTag" ADD CONSTRAINT "MemoryTag_memoryID_fkey" FOREIGN KEY ("memoryID") REFERENCES "Memory"("memoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryTag" ADD CONSTRAINT "MemoryTag_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("tagID") ON DELETE RESTRICT ON UPDATE CASCADE;
