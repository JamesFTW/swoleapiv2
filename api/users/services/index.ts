import { Users, UserPayload } from '../models'

export const createUser = (params: UserPayload, salt: string): void => {
  //the payload will also have some type of auth token I assume
  //This is probably where I want to do some type of auth
  const users = new Users()

  users.create(
    params.userName,
    params.firstName,
    params.lastName,
    params.email,
    params.password,
    salt
  )

}