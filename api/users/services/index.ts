import type { Users as PrismaUsers } from '@prisma/client'
import { Users, UserPayload } from '../models'

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

  async getByUserName(userName: string): Promise<PrismaUsers | null | undefined> {
    return this.users?.getByUserName(userName)
  }
}