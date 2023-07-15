import { Exercises } from '../models'
import { Exercises as Exercise } from '@prisma/client'


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

  async getExerciseById(exerciseId: number): Promise<Exercise | null> {
    try {
      const exercise = await this.exercise?.getExerciseById(exerciseId)

      if (!exercise) {
        return Promise.reject(new Error(`Exercise with ID ${exerciseId} not found`))
      }

      return exercise

    } catch(error) {
      return Promise.reject(new Error(`Failed to retrieve exercise by ID: ${(error as Error).message}`))
    }
  }

  async getExerciseByName(exerciseName: string): Promise<Exercise | null> {
    try {
      const exercise = this.exercise?.getExerciseByName(exerciseName)

      if (!exercise) {
        return Promise.reject(new Error(`Exercise with ID ${exerciseName} not found`))
      }

      return exercise

    } catch(error) {
      return Promise.reject(error)
    }
  }

  async getAllExercises(filter: string = ''): Promise<Exercise[] | null | undefined> {
    try {
      const allExercises = await this.exercise.getAllExercises();
      const filteredExercises = allExercises?.filter(exercise => exercise.exerciseName.includes(filter));
      return filteredExercises;
    } catch (error) {
      return Promise.reject(new Error(`Failed to retrieve all exercises: ${(error as Error).message}`));
    }
  }
}