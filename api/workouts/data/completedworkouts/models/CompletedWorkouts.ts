import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export interface CompletedWorkoutsCreateParams {
  userId: string
  comment: string | null
  userExercises: number[]
  minHeartRate: number | null
  maxHeartRate: number | null
  duration: number
  workoutTitle: string
  caloriesBurned: number | null
  primaryMuscleGroup: string
  totalVolume: number | null
  totalTime: number
  totalSets: number | null
}

export class CompletedWorkouts {
  async create(userId: string, completedWorkoutParams: CompletedWorkoutsCreateParams) {
    const {
      comment,
      userExercises,
      minHeartRate,
      maxHeartRate,
      duration,
      workoutTitle,
      caloriesBurned,
      primaryMuscleGroup,
      totalVolume,
      totalTime,
      totalSets,
    } = completedWorkoutParams

    try {
      await prisma.completedWorkouts.create({
        data: {
          User: {
            connect: { userId: userId },
          },
          userExercises: {
            connect: userExercises.map(userExerciseId => ({
              userExerciseId: userExerciseId,
            })),
          },
          userExerciseIds: userExercises,
          comment: comment,
          minHeartRate: minHeartRate,
          maxHeartRate: maxHeartRate,
          duration: duration,
          workoutTitle: workoutTitle,
          primaryMuscleGroup: primaryMuscleGroup,
          caloriesBurned: caloriesBurned,
          totalVolume: totalVolume,
          totalTime: totalTime,
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
