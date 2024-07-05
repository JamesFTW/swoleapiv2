import { WeeklySnapshotsService } from '../WeeklySnapshotsService'
import { WeeklySnapshotModel, WeeklySnapShot } from '../../models/WeeklySnapShotModel'

jest.mock('@prisma/client')
jest.mock('../../models/WeeklySnapShotModel')

describe('WeeklySnapshotsService', () => {
  let service: WeeklySnapshotsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new WeeklySnapshotsService()
  })

  describe('createOrUpdateWeeklySnapshot', () => {
    it('should create a new weekly snapshot', async () => {
      const mockCreateOrUpdate = jest.spyOn(WeeklySnapshotModel.prototype, 'createOrUpdate')
      mockCreateOrUpdate.mockResolvedValue(undefined)

      await service.createOrUpdateWeeklySnapshot('user1', 10, 1000, 60, 1)

      expect(mockCreateOrUpdate).toHaveBeenCalledWith(
        'user1',
        expect.any(Date),
        expect.any(Date),
        10,
        1000,
        60,
        1
      )
    })

    it('should throw an error if creation fails', async () => {
      const mockCreateOrUpdate = jest.spyOn(WeeklySnapshotModel.prototype, 'createOrUpdate')
      mockCreateOrUpdate.mockRejectedValue(new Error('Database error'))

      await expect(service.createOrUpdateWeeklySnapshot('user1', 10, 1000, 60, 1)).rejects.toThrow(
        'An error occurred while creating a new weekly snapshot: Database error'
      )
    })
  })

  describe('getWeeklySnapshotById', () => {
    it('should return an existing weekly snapshot', async () => {
      const mockSnapshot: WeeklySnapShot = {
        userId: 'user1',
        startDate: new Date('2023-05-08'),
        endDate: new Date('2023-05-14'),
        numberOfSets: 10,
        totalVolume: 1000,
        totalWorkoutTime: 60,
        completedWorkoutIds: [1],
      }
      const mockGetById = jest.spyOn(WeeklySnapshotModel.prototype, 'getById')
      mockGetById.mockResolvedValue(mockSnapshot)

      const result = await service.getWeeklySnapshotById('user1')

      expect(result).toEqual(mockSnapshot)
      expect(mockGetById).toHaveBeenCalledWith('user1', expect.any(Date), expect.any(Date))
    })

    it('should create and return a new snapshot if none exists', async () => {
      const mockGetById = jest.spyOn(WeeklySnapshotModel.prototype, 'getById')
      mockGetById.mockResolvedValueOnce(null).mockResolvedValueOnce({
        userId: 'user1',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        numberOfSets: 0,
        totalVolume: 0,
        totalWorkoutTime: 0,
        completedWorkoutIds: [],
      })

      const mockCreateOrUpdate = jest.spyOn(WeeklySnapshotModel.prototype, 'createOrUpdate')
      mockCreateOrUpdate.mockResolvedValue(undefined)

      const result = await service.getWeeklySnapshotById('user1')

      expect(result).toEqual({
        userId: 'user1',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        numberOfSets: 0,
        totalVolume: 0,
        totalWorkoutTime: 0,
        completedWorkoutIds: [],
      })
      expect(mockGetById).toHaveBeenCalledTimes(2)
      expect(mockCreateOrUpdate).toHaveBeenCalledWith(
        'user1',
        expect.any(Date),
        expect.any(Date),
        0,
        0,
        0,
        0
      )
    })

    it('should handle database errors when fetching snapshot', async () => {
      jest
        .spyOn(WeeklySnapshotModel.prototype, 'getById')
        .mockRejectedValue(new Error('Database error'))

      await expect(service.getWeeklySnapshotById('user1')).rejects.toThrow(
        'An error occurred while getting or creating a weekly snapshot: Database error'
      )
    })

    it('should throw an error if creation fails', async () => {
      const mockGetById = jest.spyOn(WeeklySnapshotModel.prototype, 'getById')
      mockGetById.mockResolvedValue(null)

      const mockCreateOrUpdate = jest.spyOn(WeeklySnapshotModel.prototype, 'createOrUpdate')
      mockCreateOrUpdate.mockRejectedValue(new Error('Creation error'))

      await expect(service.getWeeklySnapshotById('user1')).rejects.toThrow(
        'An error occurred while getting or creating a weekly snapshot: Creation error'
      )
    })
  })

  describe('getWeeklySnapshotDisplayData', () => {
    it('should return display data for a valid snapshot', async () => {
      const mockSnapshot: WeeklySnapShot = {
        userId: 'user1',
        startDate: new Date('2023-05-08'),
        endDate: new Date('2023-05-14'),
        numberOfSets: 10,
        totalVolume: 1000,
        totalWorkoutTime: 60,
        completedWorkoutIds: [1],
      }
      jest.spyOn(service, 'getWeeklySnapshotById').mockResolvedValue(mockSnapshot)

      const result = await service.getWeeklySnapshotDisplayData('user1')

      expect(result).toEqual({
        numberOfSets: 10,
        totalVolume: 1000,
        totalWorkoutTime: 60,
      })
    })

    it('should return default values if no existing snapshot', async () => {
      jest.spyOn(service, 'getWeeklySnapshotById').mockResolvedValue({
        userId: 'user1',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        numberOfSets: 0,
        totalVolume: 0,
        totalWorkoutTime: 0,
        completedWorkoutIds: [],
      })

      const result = await service.getWeeklySnapshotDisplayData('user1')

      expect(result).toEqual({
        numberOfSets: 0,
        totalVolume: 0,
        totalWorkoutTime: 0,
      })
    })
  })

  describe('getStartAndEndDateForWeek', () => {
    it('should return correct start and end dates for a given date', () => {
      const testDate = new Date('2023-05-10T12:00:00Z') // A Wednesday, using UTC time
      const { startDate, endDate } = service.getStartAndEndDateForWeek(testDate)

      // Create expected dates in local time
      const expectedStartDate = new Date('2023-05-08T00:00:00')
      expectedStartDate.setHours(0, 0, 0, 0)
      const expectedEndDate = new Date('2023-05-14T23:59:59.999')
      expectedEndDate.setHours(23, 59, 59, 999)

      expect(startDate).toEqual(expectedStartDate)
      expect(endDate).toEqual(expectedEndDate)
    })

    it('should handle Sunday correctly', () => {
      const testDate = new Date('2023-05-14T12:00:00Z') // A Sunday, using UTC time
      const { startDate, endDate } = service.getStartAndEndDateForWeek(testDate)

      // Create expected dates in local time
      const expectedStartDate = new Date('2023-05-08T00:00:00')
      expectedStartDate.setHours(0, 0, 0, 0)
      const expectedEndDate = new Date('2023-05-14T23:59:59.999')
      expectedEndDate.setHours(23, 59, 59, 999)

      expect(startDate).toEqual(expectedStartDate)
      expect(endDate).toEqual(expectedEndDate)
    })
  })

  describe('WeeklySnapshotsService Integration', () => {
    it('should create a snapshot and retrieve its display data', async () => {
      const userId = 'user1'
      const numberOfSets = 10
      const totalVolume = 1000
      const totalWorkoutTime = 60
      const completedWorkoutId = 1

      const mockCreateOrUpdate = jest.spyOn(WeeklySnapshotModel.prototype, 'createOrUpdate')
      mockCreateOrUpdate.mockResolvedValue(undefined)

      const mockGetById = jest.spyOn(WeeklySnapshotModel.prototype, 'getById')
      mockGetById.mockResolvedValue({
        userId,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        numberOfSets,
        totalVolume,
        totalWorkoutTime,
        completedWorkoutIds: [completedWorkoutId],
      })

      await service.createOrUpdateWeeklySnapshot(
        userId,
        numberOfSets,
        totalVolume,
        totalWorkoutTime,
        completedWorkoutId
      )

      const displayData = await service.getWeeklySnapshotDisplayData(userId)

      expect(displayData).toEqual({
        numberOfSets,
        totalVolume,
        totalWorkoutTime,
      })

      expect(mockCreateOrUpdate).toHaveBeenCalledWith(
        userId,
        expect.any(Date),
        expect.any(Date),
        numberOfSets,
        totalVolume,
        totalWorkoutTime,
        completedWorkoutId
      )

      expect(mockGetById).toHaveBeenCalledWith(userId, expect.any(Date), expect.any(Date))
    })
  })

  describe('Performance Testing', () => {
    it('should handle large number of snapshots efficiently', async () => {
      const mockCreateOrUpdate = jest.spyOn(WeeklySnapshotModel.prototype, 'createOrUpdate')
      mockCreateOrUpdate.mockResolvedValue(undefined)

      const largeDataset = Array(100000)
        .fill(null)
        .map((_, index) => ({
          userId: `user${index}`,
          numberOfSets: 10,
          totalVolume: 1000,
          totalWorkoutTime: 60,
          completedWorkoutId: index,
        }))

      const startTime = Date.now()

      for (const data of largeDataset) {
        await service.createOrUpdateWeeklySnapshot(
          data.userId,
          data.numberOfSets,
          data.totalVolume,
          data.totalWorkoutTime,
          data.completedWorkoutId
        )
      }

      const endTime = Date.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(2000)
      expect(mockCreateOrUpdate).toHaveBeenCalledTimes(100000)
    })
  })
})
