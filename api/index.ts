import express from 'express'
import userEndpoints from './users/endpoints'

const router  = express.Router()
router.use('/user', userEndpoints)

export default router