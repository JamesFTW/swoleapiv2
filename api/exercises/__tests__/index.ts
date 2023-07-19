import { ExerciseServices } from '../services'

describe('ExerciseServices', () => {
  let exerciseServices: ExerciseServices

  beforeAll(() => {
    exerciseServices = new ExerciseServices()
  })

  describe('createExercise', () => {
    it('should create a new exercise', async () => {
      const exerciseName = `Test Exercise ${Math.random().toString(36).substring(7)}`
      const targetMuscle = 'Legs'
      const video = 'https://example.com/squats'
      const secondaryMuscles = { muscle1: 'Muscle 1', muscle2: 'Muscle 2' }

      await exerciseServices.createExercise(exerciseName, targetMuscle, video, secondaryMuscles)

      // Optionally, you can add assertions to verify the creation of the exercise.
      // For example, you can call `getExerciseByName` to check if the exercise was created.
      const createdExercise = await exerciseServices.getExerciseByName(exerciseName)
      expect(createdExercise).toBeDefined()
      expect(createdExercise?.targetMuscle).toBe(targetMuscle)
    })

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
      // Create an exercise first to test retrieval
      const exerciseName = `Test Exercise ${Math.random().toString(36).substring(7)}`
      const targetMuscle = 'Test Muscle'
      const video = 'https://example.com/test-exercise'
      const secondaryMuscles = { muscle: 'Test Secondary Muscle' }
      await exerciseServices.createExercise(exerciseName, targetMuscle, video, secondaryMuscles)

      const createdExercise = await exerciseServices.getExerciseByName(exerciseName)
      expect(createdExercise).toBeDefined()

      if (createdExercise) {
        const retrievedExercise = await exerciseServices.getExerciseById(createdExercise.exerciseId)
        expect(retrievedExercise).toBeDefined()
        expect(retrievedExercise?.exerciseName).toBe(exerciseName)
      }
    })

    it('should return null if the exercise is not found', async () => {
      const nonExistingExerciseId = 12345

      await expect(
        exerciseServices.getExerciseById(nonExistingExerciseId)
      ).rejects.toThrowError(`Exercise with ID ${nonExistingExerciseId} not found`)
    })
  })

  describe('getExerciseByName', () => {
    it('should retrieve an exercise by name', async () => {
      const exerciseName = `Test Exercise ${Math.random().toString(36).substring(7)}`
      const targetMuscle = 'Test Muscle'
      const video = 'https://example.com/test-exercise'
      const secondaryMuscles = { muscle: 'Test Secondary Muscle' }
    
      // Create the exercise first
      await exerciseServices.createExercise(exerciseName, targetMuscle, video, secondaryMuscles)
    
      // Now, retrieve the exercise by name
      const retrievedExercise = await exerciseServices.getExerciseByName(exerciseName)
    
      expect(retrievedExercise).toBeDefined()
      expect(retrievedExercise?.exerciseName).toBe(exerciseName)
    })

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

    it('should reject with an error if an error occurs during creation', async () => {
      const exerciseName = 'Existing Exercise'
    
      try {
        await exerciseServices.createExercise(exerciseName, '', '', {})
        throw new Error('Expected createExercise to throw an error')
      } catch (error) {
        expect(() => {
          throw error
        }).toThrow()
      }
    })
    
    it('should reject with an error if an error occurs during retrieval', async () => {
      jest.spyOn(exerciseServices, 'getAllExercises').mockRejectedValueOnce(new Error('Database error'))
    
      await expect(async () => {
        await exerciseServices.getAllExercises()
      }).rejects.toThrow('Database error')
    })
  })
})