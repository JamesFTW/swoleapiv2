import { UserExercisesModel } from '../models'
import { PrismaClient, UserExercises } from '@prisma/client'
const prisma = new PrismaClient()

export class UserExercisesServices {
  private userExercise: UserExercisesModel

  constructor() {
    this.userExercise = new UserExercisesModel()
  }

  async create(
    exerciseId: number,
    userId: string,
    weightMoved: number,
    reps: number,
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

        // @ts-ignore
        const exerciseIdInt = parseInt(exerciseId)

        const exerciseExists = await prisma.exercises.findUnique({
          where: {
            exerciseId: exerciseIdInt,
          },
        })

        if (!exerciseExists) {
          throw new Error(
            'Exercise with the provided exerciseId does not exist.',
          )
        }

        // @ts-ignore
        const weightMovedInt = parseInt(weightMoved)

        // @ts-ignore
        const repsInt = parseInt(reps)

        await prisma.userExercises.create({
          data: {
            exercise: {
              connect: { exerciseId: exerciseIdInt },
            },
            user: {
              connect: { userId: userId },
            },
            weightMoved: weightMovedInt,
            reps: repsInt,
          },
        })
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getUserExercises(
    exerciseId: number,
    userId: string,
  ): Promise<UserExercises[] | undefined> {
    try {
      const userExercise = await this.userExercise.getUserExercise(
        exerciseId,
        userId,
      )
      return userExercise
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
