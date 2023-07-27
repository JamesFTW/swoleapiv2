import { PrismaClient, UserExercises } from '@prisma/client'
const prisma = new PrismaClient()

export class UserExercisesModel  {
  async create(
    exerciseId: number,
    userId: string,
    weightMoved: number,
  ): Promise<void> {
      try {
        await prisma.userExercises.create({
          data: {
            exerciseId,
            userId,
            weightMoved
          }
        })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getUserExercise(exerciseId: number, userId: string): Promise<UserExercises[] | undefined> {
    try {
      const userExercise = await prisma.userExercises.findMany({
        where: {
          exerciseId: exerciseId,
          userId: userId
        }
      })
      return userExercise
    } catch(error) {
      return Promise.reject(error)
    }
  }
}