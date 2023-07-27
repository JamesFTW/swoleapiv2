import { UserExercisesModel } from '../models'
import { PrismaClient } from '@prisma/client'
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
  ): Promise<void> {

    // @ts-ignore
    const exerciseIdInt = parseInt(exerciseId)
    // @ts-ignore
    const weightMovedInt = parseInt(weightMoved)

    const userExists = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    })

    if (!userExists) {
      return Promise.reject('User with the provided userId does not exist.')
    }

    const exerciseExists = await prisma.exercises.findUnique({
      where: {
        exerciseId: exerciseIdInt,
      },
    })

    if (!exerciseExists) {
      return Promise.reject('Exercise with the provided exerciseId does not exist.')
    }

    try {
      await this.userExercise.create(
        exerciseIdInt,
        userId,
        weightMovedInt,
      )
    } catch(error) {
      return Promise.reject(error)
    }
  }
}