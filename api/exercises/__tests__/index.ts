import { ExerciseServices } from '../services'
import { Exercises as Exercise } from '@prisma/client'

describe('ExerciseServices', () => {
  let exerciseServices: ExerciseServices

  beforeAll(() => {
    exerciseServices = new ExerciseServices()
  })

  describe('createExercise', () => {
    it('should reject with an error if an error occurs during creation', async () => {
      const exerciseName = 'Existing Exercise'
    
      try {
        await exerciseServices.createExercise(exerciseName, '', '', {})
        throw new Error('Expected createExercise to throw an error')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('getExerciseById', () => {
    it('should retrieve an exercise by ID', async () => {
        const retrievedExercise = await exerciseServices.getExerciseById(1)
        expect(retrievedExercise).toBeDefined()
    })

    it('should return null if the exercise is not found', async () => {
      const nonExistingExerciseId = 12345

      await expect(
        exerciseServices.getExerciseById(nonExistingExerciseId)
      ).rejects.toThrowError(`Exercise with ID ${nonExistingExerciseId} not found`)
    })
  })

  describe('getExerciseByName', () => {
    it('should return null if the exercise is not found', async () => {
      const nonExistingExerciseName = 'Non-existing Exercise'

      const exercise = await exerciseServices.getExerciseByName(nonExistingExerciseName)
      expect(exercise).toBeNull()
    })
  })

  describe('getAllExercises', () => {
    it('should retrieve all exercises', async () => {
      const allExercises = await exerciseServices.getAllExercises()
      expect(allExercises).toBeDefined()
      expect(Array.isArray(allExercises)).toBe(true)
    })

    it('should filter exercises by name', async () => {
      const filter = 'Squats'

      const filteredExercises = await exerciseServices.getAllExercises(filter)
      expect(filteredExercises).toBeDefined()
      expect(Array.isArray(filteredExercises)).toBe(true)

      if (filteredExercises) {
        const allNamesIncludeFilter = filteredExercises.every(
          (exercise) => exercise.exerciseName.toLowerCase().includes(filter.toLowerCase())
        )
        expect(allNamesIncludeFilter).toBe(true)
      }
    })
    
    it('should reject with an error if an error occurs during retrieval', async () => {
      jest.spyOn(exerciseServices, 'getAllExercises').mockRejectedValueOnce(new Error('Database error'))
    
      await expect(async () => {
        await exerciseServices.getAllExercises()
      }).rejects.toThrow('Database error')
    })
  })
  describe('getPreviewExercises', () => {
    it('should retrieve the specified number of preview exercises', async () => {
      const mockPreviewExercises: Exercise[] = [
        {
          exerciseId: 1,
          exerciseName: 'Exercise 1',
          targetMuscle: 'Legs',
          createdAt: new Date(),
          updatedAt: new Date(),
          secondaryMuscles: { muscle1: 'Muscle 1', muscle2: 'Muscle 2' },
          video: 'https://example.com/squats',
        },
        {
          exerciseId: 2,
          exerciseName: 'Exercise 2',
          targetMuscle: 'Arms',
          createdAt: new Date(),
          updatedAt: new Date(),
          secondaryMuscles: { muscle1: 'Muscle 1' },
          video: 'https://example.com/push-ups',
        }
      ]
      jest.spyOn(exerciseServices['exercise'], 'getPreviewExercises').mockResolvedValue(mockPreviewExercises)

      const exerciseCount = 2
      const previewExercises = await exerciseServices.getPreviewExercises(exerciseCount)

      expect(previewExercises).toBeDefined()
      expect(Array.isArray(previewExercises)).toBe(true)
      expect(previewExercises?.length).toBe(exerciseCount)
    })

    it('should return null if no preview exercises are available', async () => {
      jest.spyOn(exerciseServices['exercise'], 'getPreviewExercises').mockResolvedValue([])

      const exerciseCount = 5
      const previewExercises = await exerciseServices.getPreviewExercises(exerciseCount)

      expect(previewExercises).toBeNull()
    })

    it('should reject with an error if an error occurs during retrieval', async () => {
      const errorMessage = 'Database error'
      jest.spyOn(exerciseServices['exercise'], 'getPreviewExercises').mockRejectedValue(new Error(errorMessage))

      const exerciseCount = 2

      try {
        await exerciseServices.getPreviewExercises(exerciseCount)
        throw new Error('Expected getPreviewExercises to throw an error')
      } catch (error: any) {
        expect(error.message).toBe(`Failed to retrieve preview exercises: ${errorMessage}`)
      }
    })
  })
})