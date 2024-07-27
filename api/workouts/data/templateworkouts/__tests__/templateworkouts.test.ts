import { TemplateWorkoutsService } from '../services/templateWorkoutsService'
import { TemplateWorkouts } from '../models/TemplateWorkouts'
import { z } from 'zod'
import {
  CreateTemplateWorkoutDTO,
  GetTemplateWorkoutDTO,
  GetTemplateWorkoutByIdAndCreatedAtDTO,
} from '../../../schemas/schemas'

jest.mock('../models/TemplateWorkouts')

describe('TemplateWorkoutsService', () => {
  let service: TemplateWorkoutsService
  let mockCreate: jest.Mock
  let mockGetTemplateWorkoutsById: jest.Mock
  let mockGetTemplateWorkoutByIdAndCreatedAt: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreate = jest.fn()
    mockGetTemplateWorkoutsById = jest.fn()
    mockGetTemplateWorkoutByIdAndCreatedAt = jest.fn()
    TemplateWorkouts.prototype.create = mockCreate
    TemplateWorkouts.prototype.getTemplateWorkoutsById = mockGetTemplateWorkoutsById
    TemplateWorkouts.prototype.getTemplateWorkoutByIdAndCreatedAt =
      mockGetTemplateWorkoutByIdAndCreatedAt
    service = new TemplateWorkoutsService()
  })

  describe('create', () => {
    // Test case 1: Validate successful creation of a template workout
    test('should create a template workout successfully', async () => {
      const input: z.infer<typeof CreateTemplateWorkoutDTO> = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [
          { exerciseId: 1, setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
        ],
      }

      mockCreate.mockResolvedValue(undefined)

      await service.create(input)

      expect(mockCreate).toHaveBeenCalledWith(input.userId, input.templateName, input.workoutData)
    })

    // Test case 2: Handle invalid userId input
    test('should throw ZodError for invalid userId', async () => {
      const input = {
        userId: 123,
        templateName: 'My Workout',
        workoutData: [
          { exerciseId: 1, setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
        ],
      }

      await expect(service.create(input as any)).rejects.toThrow(z.ZodError)
    })

    // Test case 3: Handle invalid templateName input
    test('should throw ZodError for invalid templateName', async () => {
      const input = {
        userId: 'user123',
        templateName: 123,
        workoutData: [
          { exerciseId: 1, setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
        ],
      }

      await expect(service.create(input as any)).rejects.toThrow(z.ZodError)
    })

    // Test case 4: Handle invalid setData input (wrong exercise ID type)
    test('should throw ZodError for invalid exerciseId type in setData', async () => {
      const input = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [
          { exerciseId: '1', setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
        ],
      }

      await expect(service.create(input as any)).rejects.toThrow(z.ZodError)
    })

    // Test case 5: Handle invalid setData input (missing required field)
    test('should throw ZodError for missing required field in setData', async () => {
      const input = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [{ exerciseId: 1, setData: [{ weight: 100, reps: 10, setNumber: 1 }] }],
      }

      await expect(service.create(input as any)).rejects.toThrow(z.ZodError)
    })

    // Test case 6: Handle empty setData array
    test('should create a template workout with empty setData', async () => {
      const input: z.infer<typeof CreateTemplateWorkoutDTO> = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [],
      }

      mockCreate.mockResolvedValue(undefined)

      await service.create(input)

      expect(mockCreate).toHaveBeenCalledWith(input.userId, input.templateName, input.workoutData)
    })

    // Test case 7: Handle multiple exercises in setData
    test('should create a template workout with multiple exercises', async () => {
      const input: z.infer<typeof CreateTemplateWorkoutDTO> = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [
          { exerciseId: 1, setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
          { exerciseId: 2, setData: [{ weight: 50, reps: 15, rpe: 7, setNumber: 1 }] },
        ],
      }

      mockCreate.mockResolvedValue(undefined)

      await service.create(input)

      expect(mockCreate).toHaveBeenCalledWith(input.userId, input.templateName, input.workoutData)
    })

    // Test case 8: Handle database error during creation
    test('should throw error when database operation fails', async () => {
      const input: z.infer<typeof CreateTemplateWorkoutDTO> = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [
          { exerciseId: 1, setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
        ],
      }

      const dbError = new Error('Database error')
      mockCreate.mockRejectedValue(dbError)

      await expect(service.create(input)).rejects.toThrow(
        'An unexpected error occurred while creating the template workout'
      )
    })

    // Test case 9: Verify that non-ZodError is wrapped in a generic error
    test('should wrap non-ZodError in a generic error', async () => {
      const input: z.infer<typeof CreateTemplateWorkoutDTO> = {
        userId: 'user123',
        templateName: 'My Workout',
        workoutData: [
          { exerciseId: 1, setData: [{ weight: 100, reps: 10, rpe: 8, setNumber: 1 }] },
        ],
      }

      const nonZodError = new Error('Some other error')
      mockCreate.mockRejectedValue(nonZodError)

      await expect(service.create(input)).rejects.toThrow(
        'An unexpected error occurred while creating the template workout'
      )
    })
  })

  describe('getTemplateWorkoutsById', () => {
    // Test case 1: Successfully retrieve template workouts by user ID
    test('should retrieve template workouts successfully', async () => {
      const input: z.infer<typeof GetTemplateWorkoutDTO> = { userId: 'user123' }
      const mockWorkouts = [
        { id: 1, name: 'Workout 1' },
        { id: 2, name: 'Workout 2' },
      ]
      mockGetTemplateWorkoutsById.mockResolvedValue(mockWorkouts)

      const result = await service.getTemplateWorkoutsById(input)

      expect(mockGetTemplateWorkoutsById).toHaveBeenCalledWith(input.userId)
      expect(result).toEqual(mockWorkouts)
    })

    // Test case 2: Handle invalid user ID
    test('should throw ZodError for invalid userId', async () => {
      const input = { userId: 123 }

      await expect(service.getTemplateWorkoutsById(input as any)).rejects.toThrow(z.ZodError)
    })

    // Test case 3: Handle unexpected error
    test('should wrap unexpected error', async () => {
      const input: z.infer<typeof GetTemplateWorkoutDTO> = { userId: 'user123' }
      const unexpectedError = new Error('Unexpected error')
      mockGetTemplateWorkoutsById.mockRejectedValue(unexpectedError)

      await expect(service.getTemplateWorkoutsById(input)).rejects.toThrow(
        'An unexpected error occurred while retrieving template workouts'
      )
    })

    // Test case 4: Handle empty string userId
    test('should throw ZodError for empty string userId', async () => {
      const input = { userId: '' }

      await expect(service.getTemplateWorkoutsById(input)).rejects.toThrow(z.ZodError)
    })

    // Test case 5: Handle very long userId
    test('should accept very long userId', async () => {
      const input: z.infer<typeof GetTemplateWorkoutDTO> = { userId: 'a'.repeat(1000) }
      mockGetTemplateWorkoutsById.mockResolvedValue([])

      await expect(service.getTemplateWorkoutsById(input)).resolves.not.toThrow()
    })
  })

  describe('getTemplateWorkoutByIdAndCreatedAt', () => {
    // Test case 1: Successfully retrieve template workout by user ID and creation date
    test('should retrieve template workout successfully', async () => {
      const input: z.infer<typeof GetTemplateWorkoutByIdAndCreatedAtDTO> = {
        userId: 'user123',
        createdAt: new Date(),
      }
      const mockWorkout = { id: 1, name: 'Workout 1', createdAt: input.createdAt }
      mockGetTemplateWorkoutByIdAndCreatedAt.mockResolvedValue(mockWorkout)

      const result = await service.getTemplateWorkoutByIdAndCreatedAt(input)

      expect(mockGetTemplateWorkoutByIdAndCreatedAt).toHaveBeenCalledWith(
        input.userId,
        input.createdAt
      )
      expect(result).toEqual(mockWorkout)
    })

    // Test case 2: Handle invalid user ID
    test('should throw ZodError for invalid userId', async () => {
      const input = { userId: 123, createdAt: new Date() }

      await expect(service.getTemplateWorkoutByIdAndCreatedAt(input as any)).rejects.toThrow(
        z.ZodError
      )
    })

    // Test case 3: Handle invalid creation date
    test('should throw ZodError for invalid createdAt', async () => {
      const input = { userId: 'user123', createdAt: '2023-05-01' }

      await expect(service.getTemplateWorkoutByIdAndCreatedAt(input as any)).rejects.toThrow(
        z.ZodError
      )
    })

    // Test case 4: Handle unexpected error
    test('should wrap unexpected error', async () => {
      const input: z.infer<typeof GetTemplateWorkoutByIdAndCreatedAtDTO> = {
        userId: 'user123',
        createdAt: new Date(),
      }
      const unexpectedError = new Error('Unexpected error')
      mockGetTemplateWorkoutByIdAndCreatedAt.mockRejectedValue(unexpectedError)

      await expect(service.getTemplateWorkoutByIdAndCreatedAt(input)).rejects.toThrow(
        'An unexpected error occurred while retrieving the template workout'
      )
    })

    // Test case 5: Handle past date
    test('should accept past date', async () => {
      const input: z.infer<typeof GetTemplateWorkoutByIdAndCreatedAtDTO> = {
        userId: 'user123',
        createdAt: new Date('2000-01-01'),
      }
      mockGetTemplateWorkoutByIdAndCreatedAt.mockResolvedValue(null)

      await expect(service.getTemplateWorkoutByIdAndCreatedAt(input)).resolves.not.toThrow()
    })

    // Test case 6: Handle future date
    test('should accept future date', async () => {
      const input: z.infer<typeof GetTemplateWorkoutByIdAndCreatedAtDTO> = {
        userId: 'user123',
        createdAt: new Date('2100-01-01'),
      }
      mockGetTemplateWorkoutByIdAndCreatedAt.mockResolvedValue(null)

      await expect(service.getTemplateWorkoutByIdAndCreatedAt(input)).resolves.not.toThrow()
    })

    // Test case 7: Handle leap year date
    test('should accept leap year date', async () => {
      const input: z.infer<typeof GetTemplateWorkoutByIdAndCreatedAtDTO> = {
        userId: 'user123',
        createdAt: new Date('2024-02-29'),
      }
      mockGetTemplateWorkoutByIdAndCreatedAt.mockResolvedValue(null)

      await expect(service.getTemplateWorkoutByIdAndCreatedAt(input)).resolves.not.toThrow()
    })
  })
})
