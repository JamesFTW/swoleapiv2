import express from 'express'
import usersRoutes from './users/routes/userRoutes'
import exercisesRoutes from './exercises/routes'
import userExercisesRoutes from './userexercises/routes/userExerciseRoutes'
import workoutRoutes from './workouts/routes/workoutRoutes'

const router = express.Router()
router.use('/users', usersRoutes)
router.use('/exercises', exercisesRoutes)
router.use('/userexercises', userExercisesRoutes)
router.use('/workouts', workoutRoutes)

export default router
