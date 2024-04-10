-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR(128) NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "Exercises" (
    "exerciseId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "targetMuscle" TEXT NOT NULL,
    "secondaryMuscles" JSONB,
    "video" TEXT NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("exerciseId")
);

-- CreateTable
CREATE TABLE "UserExercises" (
    "userExerciseID" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "weightMoved" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,

    CONSTRAINT "UserExercises_pkey" PRIMARY KEY ("userExerciseID")
);

-- CreateTable
CREATE TABLE "Users" (
    "profilePhoto" TEXT,
    "bio" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "salt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercises_exerciseId_key" ON "Exercises"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercises_exerciseName_key" ON "Exercises"("exerciseName");

-- CreateIndex
CREATE UNIQUE INDEX "UserExercises_userExerciseID_key" ON "UserExercises"("userExerciseID");

-- CreateIndex
CREATE INDEX "UserExercises_userId_idx" ON "UserExercises"("userId");

-- CreateIndex
CREATE INDEX "UserExercises_exerciseId_idx" ON "UserExercises"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "UserExercises" ADD CONSTRAINT "UserExercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExercises" ADD CONSTRAINT "UserExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("exerciseId") ON DELETE RESTRICT ON UPDATE CASCADE;
