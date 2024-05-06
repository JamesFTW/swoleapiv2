import { ValidationChain, body } from 'express-validator'
import { Users as User } from '@prisma/client'
import { Users, UserPayload, UserUpdateData } from '../models/Users'
import { uploadFile, deleteFile } from '@api/utils/s3Utils'
import { config } from '@api/config/aws.config'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

export class UsersServices {
  private users: Users | null

  constructor(users?: Users) {
    this.users = users ? users : new Users()
  }

  createEmailChain = (): ValidationChain => {
    return body('email')
      .isEmail()
      .custom(async email => {
        const user = await this.getByEmail(email)

        if (user !== null) {
          throw new Error('E-mail already in use')
        }
      })
  }

  createUserChain = (): ValidationChain => {
    return body('userName').custom(async userName => {
      const user = await this.getByUserName(userName)

      if (user !== null) {
        throw new Error('Username already in use')
      }
    })
  }

  createUserPasswordChain = (): ValidationChain => {
    return body('password').isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
  }

  async createUser(params: UserPayload, salt: string): Promise<void> {
    try {
      await this.users?.create(
        params.userName,
        params.firstName,
        params.lastName,
        params.email,
        params.password,
        params.profilePhoto,
        salt,
      )
    } catch (error) {
      return Promise.reject(new Error(`Failed to create user: ${(error as Error).message}`))
    }
  }

  async getByUserName(userName: string): Promise<User | null | undefined> {
    try {
      return this.users?.getByUserName(userName)
    } catch (error) {
      return Promise.reject(
        new Error(`Failed to retrieve user by username: ${(error as Error).message}`),
      )
    }
  }

  async getByEmail(email: string): Promise<User | null | undefined> {
    try {
      const user = await this.users?.getByEmail(email)

      if (user === undefined) {
        throw new Error(`User with email ${email} not found`)
      }

      return user
    } catch (error) {
      return Promise.reject(
        new Error(`Failed to retrieve user by email: ${(error as Error).message}`),
      )
    }
  }

  async getByUserId(userId: string): Promise<User | null | undefined> {
    try {
      const userInfo = await this.users?.getByUserid(userId)

      // @ts-ignore
      delete userInfo?.password
      // @ts-ignore
      delete userInfo?.salt

      return userInfo
    } catch (error) {
      return Promise.reject(
        new Error(`Failed to retrieve user by user ID: ${(error as Error).message}`),
      )
    }
  }

  async updateProfile(userId: string, data: UserUpdateData): Promise<void | Error> {
    try {
      await this.users?.updateProfile(userId, data)
    } catch (error) {
      return new Error(`Failed to update profile: ${(error as Error).message}`)
    }
  }

  async resizeImage(file: Express.Multer.File): Promise<Buffer> {
    const resizedImage = await sharp(file.buffer)
      .resize(1080)
      .toFormat('jpeg')
      .withMetadata()
      .toBuffer()

    return resizedImage
  }

  async updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<void> {
    try {
      const resizedImage = await this.resizeImage(file)
      const timestamp = new Date().toISOString().replace(/[-:]/g, '')
      const randomFilename = `${timestamp}-${uuidv4()}.${file?.originalname.split('.').pop()}`

      file.buffer = resizedImage
      file.size = resizedImage.byteLength
      file.originalname = randomFilename

      const fileUrl = `https://${config.s3Buckets.PROFILE_PHOTOS}.s3.${config.region}.amazonaws.com/${randomFilename}`

      await uploadFile(file, config.s3Buckets.PROFILE_PHOTOS)

      const userInfo = await this.getByUserId(userId)

      if (userInfo?.profilePhoto) {
        const oldFilename = userInfo.profilePhoto.split('/').pop()
        deleteFile(config.s3Buckets.PROFILE_PHOTOS, oldFilename)
      }

      await this.users?.updateProfilePhoto(userId, fileUrl)
    } catch (error) {
      return Promise.reject(
        new Error(`Failed to update profile photo: ${(error as Error).message}`),
      )
    }
  }
}
