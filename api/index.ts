import express from 'express'
import usersEndpoints from './users/endpoints'
import exercisesEndpoints from './exercises/endpoints'

const router  = express.Router()
router.use('/users', usersEndpoints)
router.use('/exercises', exercisesEndpoints)

export default router