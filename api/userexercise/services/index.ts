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
    reps: number
  ): Promise<void> {

    const userExists = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    })

    if (!userExists) {
      return Promise.reject('User with the provided userId does not exist.')
    }

    // @ts-ignore
    const exerciseIdInt = parseInt(exerciseId)

    const exerciseExists = await prisma.exercises.findUnique({
      where: {
        exerciseId: exerciseIdInt,
      },
    })

    if (!exerciseExists) {
      return Promise.reject('Exercise with the provided exerciseId does not exist.')
    }

    // @ts-ignore
    const weightMovedInt = parseInt(weightMoved)

    // @ts-ignore
    const repsInt = parseInt(reps)

    try {
      await this.userExercise.create(
        exerciseIdInt,
        userId,
        weightMovedInt,
        repsInt
      )
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async getUserExercises(exerciseId: number, userId: string): Promise<UserExercises[] | undefined> {
    try {
      const userExercise = await this.userExercise.getUserExercise(exerciseId, userId)
      return userExercise
    } catch(error) {
      return Promise.reject(error)
    }
  }
}