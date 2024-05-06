import { PrismaClient, UserExercises as UserExercisesPrisma } from '@prisma/client'
const prisma = new PrismaClient()

export class UserExercises {
  async create(
    exerciseId: number,
    userId: string,
    weightMoved: number,
    reps: number,
    workoutId: number,
  ): Promise<void> {
    try {
      await prisma.userExercises.create({
        data: {
          exerciseId,
          userId,
          weightMoved,
          reps,
          workoutId, // Replace 0 with the actual workoutId value
        },
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getUserExercise(
    exerciseId: number,
    userId: string,
  ): Promise<UserExercisesPrisma[] | undefined> {
    try {
      const userExercise = await prisma.userExercises.findMany({
        where: {
          exerciseId: exerciseId,
          userId: userId,
        },
      })
      return userExercise
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
