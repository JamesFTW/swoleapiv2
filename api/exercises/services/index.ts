import { Exercises } from '../models'


export class ExerciseServices {
  private exercise: Exercises

  constructor() {
    this.exercise = new Exercises()
  }

  async createExercise(
    exerciseName: string,
    targetMuscle: string,
    video: string,
    secondaryMuscles: Record<string, string>
  ): Promise<void> {
    try {
      await this.exercise.create(
        exerciseName,
        targetMuscle,
        video,
        secondaryMuscles
      )
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async getExerciseById(exerciseId: number) {
    try {
      await this.exercise?.getExerciseById(exerciseId)
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async getExerciseByName(exerciseName: string) {
    try {
      await this.exercise?.getExerciseByName(exerciseName)
    } catch(error) {
      return Promise.reject(error)
    }
  }

}