import express, { Request, Response } from 'express'
import { authenticate } from '@middleware/authenticate'
import { WeeklySnapshotsService } from '../snapshots/services/WeeklySnapshotsService'
import { CompletedWorkoutsService } from '../data/completedworkouts/services/completedWorkoutsService'

const router = express.Router()

router.post('/createOrUpdateSnapshot', authenticate, async (req: Request, res: Response) => {
  const weeklySnapshot = new WeeklySnapshotsService()

  try {
    const { userId } = req.session?.passport?.user
    const { totalSets, totalVolume, totalWorkoutTime, completedWorkoutId } =
      req.body.weeklySnapshotParams

    await weeklySnapshot.createOrUpdateWeeklySnapshot(
      userId,
      totalSets,
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
  const weeklySnapshot = new WeeklySnapshotsService()
  const { userId } = req.session?.passport?.user

  try {
    const weeklySnapshotData = await weeklySnapshot.getWeeklySnapshotDisplayData(userId)
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

router.post('/createCompletedWorkout', authenticate, async (req: Request, res: Response) => {
  const completedWorkouts = new CompletedWorkoutsService()

  try {
    const { userId } = req.session?.passport?.user
    const { completedWorkoutParams } = req.body

    const completedWorkoutData = await completedWorkouts.create(userId, completedWorkoutParams)

    res.status(200).json({ completedWorkoutData })
  } catch (error: any) {
    res.status(500).json({
      message: 'Something went wrong creating a new completed workout.',
      error: error.message,
    })
  }
})

router.get('/getCompletedWorkouts', authenticate, async (req: Request, res: Response) => {
  const completedWorkouts = new CompletedWorkoutsService()
  const { userId } = req.session?.passport?.user

  try {
    const completedWorkoutsData = await completedWorkouts.getCompletedWorkoutsById(userId)
    res.status(200).json({
      completedWorkoutsData,
    })
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong we getting completed workouts for userid: ${userId}`,
      error: error,
    })
  }
})

export default router
