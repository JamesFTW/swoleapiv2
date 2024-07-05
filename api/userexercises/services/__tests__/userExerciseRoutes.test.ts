import { UserExercisesServices } from '../userExerciseServices'
import { isUserExerciseSetParams, UserExerciseCreateParams } from '../../models/UserExercises'

jest.mock('../../models/UserExercises', () => ({
  UserExercises: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    getUserExercise: jest.fn(),
  })),
  isUserExerciseSetParams: jest.fn().mockReturnValue(true),
}))

describe('UserExercisesServices', () => {
  let userExerciseService: UserExercisesServices

  beforeEach(() => {
    userExerciseService = new UserExercisesServices() as jest.Mocked<UserExercisesServices>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    //figure out how to mock a successful create
    it('should throw an error if exercise ID is missing', async () => {
      const userId = 'user123'
      const userExerciseData = [
        {
          exerciseSetsData: [
            {
              setNumber: 1,
              reps: 10,
              rpe: 8,
              weight: 50,
              userId,
            },
          ],
        },
      ] as UserExerciseCreateParams[]

      await expect(userExerciseService.create(userId, userExerciseData)).rejects.toThrow(
        'Exercise id is required.'
      )
    })

    it('should throw an error if exercise sets data is missing', async () => {
      const userId = 'user123'
      const userExerciseData = [
        {
          exerciseId: 1,
        },
      ] as UserExerciseCreateParams[]

      await expect(userExerciseService.create(userId, userExerciseData)).rejects.toThrow(
        'Exercise sets data is required.'
      )
    })

    it('should throw an error if exercise ID is of invalid type', async () => {
      const userId = 'user123'
      const userExerciseData = [
        {
          exerciseId: 'invalid' as unknown as number,
          exerciseSetsData: [
            {
              setNumber: 1,
              reps: 10,
              rpe: 8,
              weight: 50,
              userId,
            },
          ],
        },
      ]

      await expect(userExerciseService.create(userId, userExerciseData)).rejects.toThrow(
        'Exercise id must be a number.'
      )
    })

    it('should throw an error if exercise set data types are invalid', async () => {
      const userId = 'user123'
      const userExerciseData = [
        {
          exerciseId: 1,
          exerciseSetsData: [
            {
              setNumber: 'invalid' as unknown as number,
              reps: 'invalid' as unknown as number,
              rpe: 'invalid' as unknown as number,
              weight: 'invalid' as unknown as number,
              userId: 123 as unknown as string,
            },
          ],
        },
      ]

      ;(isUserExerciseSetParams as unknown as jest.Mock).mockReturnValueOnce(false)

      await expect(userExerciseService.create(userId, userExerciseData)).rejects.toThrow(
        'Exercise sets data is invalid.'
      )
    })
  })
})
