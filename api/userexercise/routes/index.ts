import express, { Request, Response } from 'express'
import { UserExercisesServices } from '../services'

const router  = express.Router()
const userExerciseService = new UserExercisesServices()

router.post('/create', async (req: Request, res: Response) => {
  try {
    console.log(req.isAuthenticated())
    if (req.body) {
      if (req.isAuthenticated()) {
        const userExercisesPayload = req.body
        const { exerciseId, userId, weightMoved } = userExercisesPayload

        console.log(userExercisesPayload)

        await userExerciseService.create(exerciseId, userId, weightMoved)

      res.sendStatus(200)
    } else {
        res.status(500).json({
          message: "Error: Request body is missing",
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong creating a new user exercise.",
      error: error
    })
  }
})

export default router