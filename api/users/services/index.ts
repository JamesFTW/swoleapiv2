import { ValidationChain, body } from 'express-validator'
import { Users as User } from '@prisma/client'
import { Users, UserPayload } from '../models'

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
        salt,
      )
    } catch (error) {
      return Promise.reject(
        new Error(`Failed to create user: ${(error as Error).message}`),
      )
    }
  }

  async getByUserName(userName: string): Promise<User | null | undefined> {
    try {
      return this.users?.getByUserName(userName)
    } catch (error) {
      return Promise.reject(
        new Error(
          `Failed to retrieve user by username: ${(error as Error).message}`,
        ),
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
        new Error(
          `Failed to retrieve user by email: ${(error as Error).message}`,
        ),
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
        new Error(
          `Failed to retrieve user by user ID: ${(error as Error).message}`,
        ),
      )
    }
  }
}
