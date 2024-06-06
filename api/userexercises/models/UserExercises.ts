import { PrismaClient, UserExercises as UserExercisesPrisma } from '@prisma/client'

const prisma = new PrismaClient()

export type UserExerciseSetParams = {
  reps: number
  weight: number
  rpe: number
  setNumber: number
  userId: string
}

export type UserExerciseCreateParams = {
  exerciseId: number
  userExerciseSetData: UserExerciseSetParams[]
}

export function isUserExerciseSetParams(obj: any): obj is UserExerciseSetParams {
  return (
    typeof obj.reps === 'number' &&
    typeof obj.weight === 'number' &&
    (typeof obj.rpe === 'number' || typeof obj.rpe === 'undefined') &&
    typeof obj.setNumber === 'number' &&
    typeof obj.userId === 'string'
  )
}

export class UserExercises {
  async create(
    exerciseId: number,
    userId: string,
    userExerciseSetData: UserExerciseSetParams[]
  ): Promise<void> {
    try {
      await prisma.$transaction(async prisma => {
        const userExists = await prisma.users.findUnique({
          where: {
            userId: userId,
          },
        })

        if (!userExists) {
          throw new Error('User with the provided userId does not exist.')
        }

        const exerciseExists = await prisma.exercises.findUnique({
          where: {
            exerciseId: exerciseId,
          },
        })

        if (!exerciseExists) {
          throw new Error('Exercise with the provided exerciseId does not exist.')
        }

        await prisma.userExercises.upsert({
          where: {
            exerciseId_userId: {
              userId: userId,
              exerciseId: exerciseId,
            },
          },
          update: {
            updatedAt: new Date().toISOString(),
            UserExerciseSets: {
              create: userExerciseSetData,
            },
          },
          create: {
            exercise: {
              connect: { exerciseId: exerciseId },
            },
            user: {
              connect: { userId: userId },
            },
            UserExerciseSets: {
              create: userExerciseSetData,
            },
          },
        })
      })
    } catch (error) {
      throw error
    }
  }

  async getUserExercise(
    exerciseId: number,
    userId: string
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
      throw error
    }
  }
}
