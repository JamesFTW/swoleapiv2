import express, { Request, Response } from 'express'
import { authenticate } from '@middleware/authenticate'
import { WeeklySnapshotsService } from '../snapshots/services/WeeklySnapshotsService'

const router = express.Router()
const weeklySnapshot = new WeeklySnapshotsService()

router.post('/createSnapshot', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.session?.passport?.user
    const { numberOfSets, totalVolume, totalWorkoutTime, completedWorkoutId } = req.body

    await weeklySnapshot.createOrUpdateWeeklySnapshot(
      userId,
      numberOfSets,
      totalVolume,
      totalWorkoutTime,
      completedWorkoutId
    )

    res.sendStatus(200)
  } catch (error: any) {
    res.status(500).json({
      message: 'Something went wrong creating a new weekly snapshot.',
      error: error.message,
    })
  }
})

router.get('/getSnapshot', authenticate, async (req: Request, res: Response) => {
  const { userId } = req.session?.passport?.user

  try {
    const weeklySnapshotData = await weeklySnapshot.getWeeklySnapshotById(userId)
    res.status(200).json({
      weeklySnapshotData,
    })
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong we getting weekly snapshot for userid: ${userId}`,
      error: error,
    })
  }
})

export default router
