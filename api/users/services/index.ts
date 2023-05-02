import { Users, UserPayload } from '../models'

export const createUser = (params: UserPayload): void => {
  const users = new Users()

  users.create(
    params.userName,
    params.firstName,
    params.lastName,
    params.email,
    params.password,
  )

}