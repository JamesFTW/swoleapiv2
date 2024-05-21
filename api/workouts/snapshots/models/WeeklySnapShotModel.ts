import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export interface WeeklySnapshotCreateParams {
  userId: string
  startDate: Date
  endDate: Date
  numberOfSets: number
  totalVolume: number
  totalWorkoutTime: number
  completedWorkoutId: number
}

export interface WeeklySnapShot {
  userId: string
  startDate: Date
  endDate: Date
  numberOfSets: number
  totalVolume: number
  totalWorkoutTime: number
  completedWorkoutIds: number[]
}

export class WeeklySnapshotModel {
  async createOrUpdate(
    userId: string,
    startDate: Date,
    endDate: Date,
    numberOfSets: number,
    totalVolume: number,
    totalWorkoutTime: number,
    completedWorkoutId: number
  ): Promise<void> {
    try {
      await prisma.weeklySnapshots.upsert({
        where: {
          userId_startDate_endDate: {
            userId: userId,
            startDate: startDate,
            endDate: endDate,
          },
        },
        update: {
          updatedAt: new Date().toISOString(),
          numberOfSets: { increment: numberOfSets },
          totalVolume: { increment: totalVolume },
          totalWorkoutTime: { increment: totalWorkoutTime },
          completedWorkoutIds: { push: completedWorkoutId },
        },
        create: {
          User: {
            connect: { userId: userId },
          },
          startDate: startDate,
          endDate: endDate,
          numberOfSets: numberOfSets,
          totalVolume: totalVolume,
          totalWorkoutTime: totalWorkoutTime,
          completedWorkoutIds: [completedWorkoutId],
        },
      })
    } catch (error) {
      throw new Error(
        `An error occurred while creating a new weekly snapshot: ${(error as Error).message}`
      )
    }
  }

  async getById(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WeeklySnapShot | null | undefined> {
    try {
      return await prisma.weeklySnapshots.findUnique({
        where: {
          userId_startDate_endDate: {
            userId: userId,
            startDate: startDate,
            endDate: endDate,
          },
        },
      })
    } catch (error) {
      throw new Error(
        `An error occurred while fetching the weekly snapshot: ${(error as Error).message}`
      )
    }
  }

  async getAll(userId: string): Promise<WeeklySnapShot[] | null | undefined> {
    try {
      return await prisma.weeklySnapshots.findMany({
        where: {
          userId: userId,
        },
      })
    } catch (error) {
      throw new Error(
        `An error occurred while fetching the weekly snapshots: ${(error as Error).message}`
      )
    }
  }
}
