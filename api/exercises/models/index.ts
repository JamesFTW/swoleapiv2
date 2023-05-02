import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export interface ExercisesPayload {
  exerciseName: string
  targetMuscle: string,
  video: string,
  secondaryMuscles: Record<string, string>,
}

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
}