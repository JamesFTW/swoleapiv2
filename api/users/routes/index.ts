import bcrypt from 'bcrypt'
import multer from 'multer'
import passport from '../authentication'
import express, { Request, Response } from 'express'
import { UsersServices } from '../services'
import { UserPayload, userUpdateDataObj } from '../models'
import { validationResult } from 'express-validator'
import { authenticate } from '@middleware/authenticate'
import { MIME_TYPES, HTTP_STATUS_CODES } from '@api/config/http.config'
import { UserUpdateData } from '../models'

const router = express.Router()
const usersServices = new UsersServices()
const upload = multer({
  limits: {
    fileSize: Infinity,
    fieldSize: Infinity,
  },
})

router.get('/', authenticate, (req: Request, res: Response) => {
  try {
    const { passport } = req.session
    res.status(HTTP_STATUS_CODES.OK).json({ passport })
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong when getting user profile.',
      error: error,
    })
  }
})

router.post(
  '/signup',
  usersServices.createEmailChain(),
  usersServices.createUserChain(),
  usersServices.createUserPasswordChain(),
  async (req: Request, res: Response, next) => {
    const userPayload: UserPayload = req.body
    const salt: string = await bcrypt.genSalt(16)

    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) {
        return next(err)
      }
      try {
        if (req.body) {
          req.body.password = hashedPassword

          await usersServices.createUser(userPayload, salt)

          res.sendStatus(HTTP_STATUS_CODES.OK)
          res.end()
        }
      } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong creating a new user.',
          errors: error,
          validationResult: validationResult(req),
        })
      }
    })
  },
)

router.post(
  '/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/api/users/login/success',
    failureRedirect: '/api/users/login/failed',
    failureMessage: true,
  }),
)

/**
 * Profile info and workouts can be in a session.
 */
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  const { session } = req
  const userInfo = await usersServices.getByUserId(
    session.passport?.user?.userId,
  )

  res.status(HTTP_STATUS_CODES.OK).json({
    userInfo,
  })
})

router.post(
  '/profile/update/photo',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { file, session } = req

      if (!file) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send('No file uploaded.')
      }

      if (!MIME_TYPES[file.mimetype]) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send('File type not supported.')
      }

      await usersServices.updateProfilePhoto(
        session.passport?.user?.userId,
        file,
      )

      res.status(HTTP_STATUS_CODES.OK).send('File uploaded successfully.')
    } catch (e) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: 'Error uploading profile photo:',
        error: e,
      })
    }
  },
)

router.put(
  '/profile/update',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { session } = req
      const data: UserUpdateData = req.body

      const validFields = Object.keys(data).every(field =>
        Object.keys(userUpdateDataObj).includes(field),
      )
      if (!validFields) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          message: 'Error updating profile:',
          error: 'Invalid field in profile update request body',
        })
      }

      await usersServices.updateProfile(session.passport?.user?.userId, data)

      res.status(HTTP_STATUS_CODES.OK).send('Profile updated successfully.')
    } catch (e) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating profile:',
        error: e,
      })
    }
  },
)

router.get('/login/success', authenticate, (req: Request, res: Response) => {
  const { session, sessionID } = req
  res.status(HTTP_STATUS_CODES.OK).json({
    session,
    sessionID,
  })
})

router.get('/login/failed', (req: Request, res: Response) => {
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: 'Username or Password is invalid',
  })
})

router.post('/logout', (req: Request, res: Response) => {
  req.logout(error => {
    if (error) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong when logging out.',
        error: error,
      })
    }
    res.sendStatus(HTTP_STATUS_CODES.OK_NOT_CONTENT)
  })
})

export default router
