import { CompletedWorkouts, CompletedWorkoutsCreateParams } from '../models/CompletedWorkouts'

export class CompletedWorkoutsService {
  private completedWorkouts: CompletedWorkouts

  constructor() {
    this.completedWorkouts = new CompletedWorkouts()
  }

  async create(userId: string, completedWorkoutParams: CompletedWorkoutsCreateParams) {
    try {
      return this.completedWorkouts.create(userId, completedWorkoutParams)
    } catch (error) {
      throw error
    }
  }

  async getCompletedWorkoutsById(userId: string) {
    try {
      return this.completedWorkouts.getCompletedWorkoutsById(userId)
    } catch (error) {
      throw error
    }
  }
}
