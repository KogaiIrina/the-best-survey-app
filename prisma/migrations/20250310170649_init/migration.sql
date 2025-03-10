-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "options" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Response" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "answer" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Response_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
