import {
  WeeklySnapshotModel,
  WeeklySnapShot,
  WeeklySnapShotDisplay,
} from '../models/WeeklySnapShotModel'

export class WeeklySnapshotsService {
  private weeklySnapshots: WeeklySnapshotModel | null

  constructor() {
    this.weeklySnapshots = new WeeklySnapshotModel()
  }

  async createOrUpdateWeeklySnapshot(
    userId: string,
    numberOfSets: number,
    totalVolume: number,
    totalWorkoutTime: number,
    completedWorkoutId: number
  ): Promise<void> {
    try {
      const { startDate, endDate } = this.getStartAndEndDateForWeek(new Date())

      await this.weeklySnapshots?.createOrUpdate(
        userId,
        startDate,
        endDate,
        numberOfSets,
        totalVolume,
        totalWorkoutTime,
        completedWorkoutId
      )
    } catch (error) {
      throw new Error(
        `An error occurred while creating a new weekly snapshot: ${(error as Error).message}`
      )
    }
  }

  async getWeeklySnapshotById(userId: string): Promise<WeeklySnapShot | null | undefined> {
    const { startDate, endDate } = this.getStartAndEndDateForWeek(new Date())

    try {
      return await this.weeklySnapshots?.getById(userId, startDate, endDate)
    } catch (error) {
      throw new Error(
        `An error occurred while getting a weekly snapshot: ${(error as Error).message}`
      )
    }
  }

  async getWeeklySnapshotDisplayData(userId: string): Promise<WeeklySnapShotDisplay | null> {
    try {
      const weeklySnapshot = await this.getWeeklySnapshotById(userId)

      if (weeklySnapshot) {
        const { numberOfSets, totalVolume, totalWorkoutTime } = weeklySnapshot
        return { numberOfSets, totalVolume, totalWorkoutTime }
      }

      return null
    } catch (error) {
      throw new Error(
        `An error occurred while getting the weekly snapshot display data: ${(error as Error).message}`
      )
    }
  }

  getStartAndEndDateForWeek(date: Date): { startDate: Date; endDate: Date } {
    try {
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)

      const startDate = new Date(date)
      startDate.setDate(diff)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)

      return { startDate, endDate }
    } catch (error) {
      throw new Error(
        `An error occurred while getting the start and end date for the week: ${(error as Error).message}`
      )
    }
  }
}
