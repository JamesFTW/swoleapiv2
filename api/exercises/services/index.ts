import { Exercises, ExercisesPayload } from '../models'

export const createExercise = (params: ExercisesPayload): void => {
  const excercises = new Exercises()

  excercises.create(
    params.exerciseName,
    params.targetMuscle,
    params.video,
    params.secondaryMuscles,
  )

}