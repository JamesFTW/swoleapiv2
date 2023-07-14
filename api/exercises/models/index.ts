import { PrismaClient, Exercises as Exercise } from '@prisma/client'
const prisma = new PrismaClient()

export class Exercises  {
  async create(
    exerciseName: string,
    targetMuscle: string,
    video: string,
    secondaryMuscles: Record<string, string>,
  ) {
      try {
        await prisma.exercises.create({
          data: {
            exerciseName,
            targetMuscle,
            video,
            secondaryMuscles,
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  async getExerciseById(exerciseId: number): Promise<Exercise | null> {
    try {
      const exercise = await prisma.exercises.findUnique({
        where: {
          exerciseId: exerciseId
        }
      })
      return exercise

    } catch (error) {
      throw new Error(
        `An error occurred while fetching the exerciseId: ${(error as Error).message}`
      )
    }
  }

  async getExerciseByName(exerciseName: string): Promise<Exercise | null> {
    try {
      const exercise = await prisma.exercises.findUnique({
        where: {
          exerciseName: exerciseName
        }
      })
      return exercise

    } catch (error) {
      throw new Error(
        `An error occurred while fetching exerciseName: ${(error as Error).message}`
      )
    }
  }
}