import { PrismaClient } from '@prisma/client'
import { WorkoutData } from '../../../schemas/schemas'

const prisma = new PrismaClient()

export class TemplateWorkouts {
  async create(userId: string, templateName: string, workoutData: WorkoutData[]): Promise<void> {
    await prisma.$transaction(async tx => {
      const templateWorkout = await tx.templateWorkouts.create({
        data: {
          userId,
          templateName,
        },
      })

      const templateExercisesData = workoutData.map(workout => ({
        templateId: templateWorkout.templateId,
        exerciseId: workout.exerciseId,
        setData: workout.setData,
      }))

      await tx.templateWorkoutExercises.createMany({
        data: templateExercisesData,
      })
    })
  }

  async getTemplateWorkoutsById(userId: string) {
    return prisma.templateWorkouts.findMany({
      where: {
        userId,
      },
    })
  }

  async getTemplateWorkoutByIdAndCreatedAt(userId: string, createdAt: Date) {
    return prisma.templateWorkouts.findFirst({
      where: {
        userId,
        createdAt,
      },
    })
  }
}
