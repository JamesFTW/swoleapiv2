import {
  UserExercises,
  UserExerciseSetParams,
  UserExerciseCreateParams,
  isUserExerciseSetParams,
} from '../models/UserExercises'
import { UserExercises as UserExercisesPrisma } from '@prisma/client'

export class UserExercisesServices {
  private userExercise: UserExercises

  constructor() {
    this.userExercise = new UserExercises()
  }

  async create(userId: string, userExerciseData: UserExerciseCreateParams[]): Promise<void> {
    const createUserExercises = userExerciseData.map(
      async (userExercise: UserExerciseCreateParams) => {
        const { exerciseId, exerciseSetsData } = userExercise

        if (!exerciseId) {
          throw new Error('Exercise id is required.')
        }

        if (!exerciseSetsData) {
          throw new Error('Exercise sets data is required.')
        }

        if (typeof exerciseId !== 'number') {
          throw new Error('Exercise id must be a number.')
        }

        const exerciseSetsDataAdjusted = exerciseSetsData.map((item: UserExerciseSetParams) => {
          const data = {
            setNumber: item.setNumber,
            reps: item.reps,
            rpe: item.rpe,
            weight: item.weight,
            userId: userId,
          }

          if (!isUserExerciseSetParams(data)) {
            throw new Error('Exercise sets data is invalid.')
          }

          return data
        })

        try {
          return this.userExercise.create(exerciseId, userId, exerciseSetsDataAdjusted)
        } catch (error) {
          throw error
        }
      }
    )

    await Promise.all(createUserExercises)
  }

  async getUserExercises(
    exerciseId: number,
    userId: string
  ): Promise<UserExercisesPrisma[] | undefined> {
    try {
      const userExercise = await this.userExercise.getUserExercise(exerciseId, userId)
      return userExercise
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
