import express from 'express'
import usersRoutes from './users/routes'
import exercisesRoutes from './exercises/routes'

const router  = express.Router()
router.use('/users', usersRoutes)
router.use('/exercises', exercisesRoutes)

export default router