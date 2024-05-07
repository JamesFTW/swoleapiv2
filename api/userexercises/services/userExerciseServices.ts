import { UserExercises, UserExerciseSetParams } from '../models/UserExercises'
import { UserExercises as UserExercisesPrisma } from '@prisma/client'

export class UserExercisesServices {
  private userExercise: UserExercises

  constructor() {
    this.userExercise = new UserExercises()
  }

  async create(
    exerciseId: number,
    userId: string,
    workoutId: string,
    userExerciseSetData: UserExerciseSetParams[],
  ): Promise<void> {
    try {
      await this.userExercise.create(exerciseId, userId, workoutId, userExerciseSetData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getUserExercises(
    exerciseId: number,
    userId: string,
  ): Promise<UserExercisesPrisma[] | undefined> {
    try {
      const userExercise = await this.userExercise.getUserExercise(exerciseId, userId)
      return userExercise
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
