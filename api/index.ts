import express from 'express'
import usersEndpoints from './users/endpoints'

const router  = express.Router()
router.use('/users', usersEndpoints)

export default router