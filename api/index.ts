import express from 'express'
import usersRoutes from './users/routes'
import exercisesRoutes from './exercises/routes'
import userExercisesRoutes from './userexercise/routes'

const router  = express.Router()
router.use('/users', usersRoutes)
router.use('/exercises', exercisesRoutes)
router.use('/userExercises', userExercisesRoutes)

export default router