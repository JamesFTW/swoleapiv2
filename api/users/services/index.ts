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

  async getByUserName(userName: string): Promise<User | null | undefined> {
    return this.users?.getByUserName(userName)
  }
}