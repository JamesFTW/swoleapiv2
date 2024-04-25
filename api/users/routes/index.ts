import bcrypt from 'bcrypt'
import multer from 'multer'
import passport from '../authentication'
import express, { Request, Response } from 'express'
import { UsersServices } from '../services'
import { UserPayload } from '../models'
import { validationResult } from 'express-validator'
import { uploadFile } from '../../utils/s3Upload'
import { s3Buckets } from '../../config/s3.config'
import { authenticate } from '../../middleware/authenticate'
import { MIME_TYPES, HTTP_STATUS_CODES } from '../../config/http.config'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const usersServices = new UsersServices()
const upload = multer({
  limits: {
    fileSize: Infinity,
    fieldSize: Infinity,
  },
});

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
    /**TODO:
     * Get passord chain working correctly
     */

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
  '/profile/photo',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { file } = req

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

      //TODO: Add photo scaling

      const timestamp = new Date().toISOString().replace(/[-:]/g, '');
      const randomFilename = `${timestamp}-${uuidv4()}.${file.originalname.split('.').pop()}`;

      file.originalname = randomFilename;

      uploadFile(file, s3Buckets.PROFILE_PHOTOS)
      res.status(HTTP_STATUS_CODES.OK).send('File uploaded successfully.')
    } catch (e) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: 'Error uploading profile photo:',
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
