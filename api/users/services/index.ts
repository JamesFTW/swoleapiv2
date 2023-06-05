import { body }   from 'express-validator'
import { Users, User, UserPayload } from '../models'

export class UsersServices {
  private users: Users | null;

  constructor() {
    this.users = new Users()
  }

  createEmailChain = () => {
    return body('email').isEmail()
      .custom(async email => {

        const user = await this.getByEmail(email)

        if (user !== null) {
          throw new Error('E-mail already in use')
        }
    })
  }

  createUserChain = () => {
    return body('userName')
      .custom(async userName => {

        const user = await this.getByUserName(userName)

        if (user !== null) {
          throw new Error('Username already in use')
        }
      })
  }

  createUserPasswordChain = () => {
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
        salt
      )
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async getByUserName(userName: string): Promise<User | null | undefined> {
    try {
      return this.users?.getByUserName(userName)
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async getByEmail(email: string): Promise<User | null | undefined> {
    try {
      return this.users?.getByEmail(email)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}