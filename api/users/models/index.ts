import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export interface UserPayload {
  userName: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export class Users  {
  async create(
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
      try {
        await prisma.users.create({
          data: {
            userName,
            firstName,
            lastName,
            email,
            password,
          }
        })
    } catch (e) {
      console.log(e)
    }
  }
}