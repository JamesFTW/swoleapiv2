import express from 'express'
import usersRoutes from './users/routes/userRoutes'
import exercisesRoutes from './exercises/routes'
import userExercisesRoutes from './userexercise/routes'

const router = express.Router()
router.use('/users', usersRoutes)
router.use('/exercises', exercisesRoutes)
router.use('/userexercises', userExercisesRoutes)

export default router
