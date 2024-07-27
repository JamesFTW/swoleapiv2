import { TemplateWorkouts } from '../models/TemplateWorkouts'
import {
  CreateTemplateWorkoutDTO,
  GetTemplateWorkoutDTO,
  GetTemplateWorkoutByIdAndCreatedAtDTO,
} from '../../../schemas/schemas'
import { z } from 'zod'

export class TemplateWorkoutsService {
  private templateWorkouts: TemplateWorkouts

  constructor() {
    this.templateWorkouts = new TemplateWorkouts()
  }

  async create(data: z.infer<typeof CreateTemplateWorkoutDTO>) {
    try {
      const { userId, templateName, workoutData } = CreateTemplateWorkoutDTO.parse(data)

      return await this.templateWorkouts.create(userId, templateName, workoutData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error
      }
      throw new Error('An unexpected error occurred while creating the template workout')
    }
  }

  async getTemplateWorkoutsById(data: z.infer<typeof GetTemplateWorkoutDTO>) {
    try {
      const { userId } = GetTemplateWorkoutDTO.parse(data)

      return await this.templateWorkouts.getTemplateWorkoutsById(userId)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error
      }
      throw new Error('An unexpected error occurred while retrieving template workouts')
    }
  }

  async getTemplateWorkoutByIdAndCreatedAt(
    data: z.infer<typeof GetTemplateWorkoutByIdAndCreatedAtDTO>
  ) {
    try {
      const { userId, createdAt } = GetTemplateWorkoutByIdAndCreatedAtDTO.parse(data)

      return await this.templateWorkouts.getTemplateWorkoutByIdAndCreatedAt(userId, createdAt)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error
      }
      throw new Error('An unexpected error occurred while retrieving the template workout')
    }
  }
}
