import { z } from 'zod'

export const SetDataSchema = z.object({
  weight: z.number(),
  reps: z.number(),
  rpe: z.number(),
  setNumber: z.number(),
})

export const WorkoutDataSchema = z.object({
  exerciseId: z.number(),
  setData: z.array(SetDataSchema),
})

export type WorkoutData = z.infer<typeof WorkoutDataSchema>

export const CreateTemplateWorkoutDTO = z.object({
  userId: z.string(),
  templateName: z.string(),
  workoutData: z.array(WorkoutDataSchema),
})

export const GetTemplateWorkoutDTO = z.object({
  userId: z.string().min(1),
})

export const GetTemplateWorkoutByIdAndCreatedAtDTO = z.object({
  userId: z.string(),
  createdAt: z.date(),
})
