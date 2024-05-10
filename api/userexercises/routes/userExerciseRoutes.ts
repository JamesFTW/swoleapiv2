import express, { Request, Response } from 'express'
import { authenticate } from '@middleware/authenticate'
import { UserExercisesServices } from '../services/userExerciseServices'
import { UserExerciseSetParams, UserExerciseCreateParams } from '../models/UserExercises'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const userExerciseService = new UserExercisesServices()

router.post('/create', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.session?.passport?.user
    const userExerciseData = req.body

    const createUserExercises = userExerciseData.map(
      async (userExercise: UserExerciseCreateParams) => {
        const { exerciseId, exerciseSetsData } = userExercise

        const userExerciseSetDataAdjusted = exerciseSetsData.map((item: UserExerciseSetParams) => {
          return {
            setNumber: item.setNumber,
            reps: item.reps,
            rpe: item.rpe,
            weight: item.weight,
            userId: userId,
          }
        })

        return userExerciseService.create(exerciseId, userId, uuidv4(), userExerciseSetDataAdjusted)
      },
    )

    await Promise.all(createUserExercises)

    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong creating a new user exercise.',
      error: error,
    })
  }
})

router.get('/:userid/:exerciseid', authenticate, async (req: Request, res: Response) => {
  const { userid, exerciseid } = req.params

  try {
    const userExercise = await userExerciseService.getUserExercises(parseInt(exerciseid), userid)
    res.status(200).json({
      userExercise,
    })
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong we getting userexercise for userid: ${userid} exerciseid: ${exerciseid}`,
      error: error,
    })
  }
})

export default router
