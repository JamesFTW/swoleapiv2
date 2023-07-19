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
    } catch (error) {
      throw new Error(
        `An error occurred while creating a new exercise: ${(error as Error).message}`
      )
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

  async getAllExercises(num?: number): Promise<Exercise[] | null> {
    try {
      const allExercises = await prisma.exercises.findMany({
        orderBy: {
          exerciseName: 'asc'
        }
      })
      return allExercises

    } catch(error) {
      throw new Error(
        `An error occurred while fetching all exercises: ${(error as Error).message}`
      )
    }
  }

  async getPreviewExercises(take: number): Promise<Exercise[] | null> {
    try {
      const exerciseCount = await prisma.exercises.count()
      const skip = Math.floor(Math.random() * exerciseCount)
      const allExercises = await prisma.exercises.findMany({
        take: take,
        skip: skip,
        orderBy: {
          exerciseName: 'asc'
        }
      })
      return allExercises

    } catch(error) {
      throw new Error(
        `An error occurred while fetching all exercises: ${(error as Error).message}`
      )
    }
  }
}