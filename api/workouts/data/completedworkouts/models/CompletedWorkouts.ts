import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export interface CompletedWorkoutsCreateParams {
  userId: string
  comment: string | null
  exercises: number[]
  minHeartRate: number | null
  maxHeartRate: number | null
  duration: number
  workoutTitle: string
  caloriesBurned: number | null
  primaryMuscleGroups: string
  totalVolume: number | null
  totalTime: number
  totalSets: number | null
}

export class CompletedWorkouts {
  async create(userId: string, completedWorkoutParams: CompletedWorkoutsCreateParams) {
    const {
      comment,
      exercises,
      minHeartRate,
      maxHeartRate,
      duration,
      workoutTitle,
      caloriesBurned,
      primaryMuscleGroups,
      totalVolume,
      totalSets,
    } = completedWorkoutParams

    try {
      await prisma.completedWorkouts.create({
        data: {
          User: {
            connect: { userId: userId },
          },
          exercises: {
            connect: exercises.map(exerciseId => ({
              exerciseId: exerciseId,
            })),
          },
          exerciseIds: exercises,
          comment: comment,
          minHeartRate: minHeartRate,
          maxHeartRate: maxHeartRate,
          duration: duration,
          workoutTitle: workoutTitle,
          primaryMuscleGroups: primaryMuscleGroups,
          caloriesBurned: caloriesBurned,
          totalVolume: totalVolume,
          totalSets: totalSets,
        },
      })
    } catch (error) {
      throw error
    }
  }

  getCompletedWorkoutsById(userId: string) {
    try {
      return prisma.completedWorkouts.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      throw error
    }
  }
}
