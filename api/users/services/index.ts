import { ExpressValidator }         from 'express-validator'
import { Users, User, UserPayload } from '../models'

export class UsersServices {
  private users: Users | null;

  constructor() {
    this.users = new Users()
  }

  async createUser(params: UserPayload, salt: string): Promise<void> {
    /**
     * Add field validation here
     */
    this.users?.create(
      params.userName,
      params.firstName,
      params.lastName,
      params.email,
      params.password,
      salt
    )
  }
  // async isValidEmail(): Promise<User | null | undefined| boolean> {
  //   const { body } = new ExpressValidator({
  //     isEmailNotInUse: async (value: string) => {
  //       const usersServices = new UsersServices()
  //       const user = await usersServices.getByEmail(value)
    
  //       if (user) {
  //         throw new Error('E-mail already in use');
  //       }
  //     },
  //   })
  // }
  async getByUserName(userName: string): Promise<User | null | undefined> {
    return this.users?.getByUserName(userName)
  }

  async getByEmail(email: string): Promise<User | null | undefined> {
    return this.users?.getByEmail(email)
  }
}