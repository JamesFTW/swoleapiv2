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
            salt
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  async getByUserName(userName: string) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userName: userName
        }
      })

      return user
    } catch (e) {
      console.log(e)
    }
  }

  async getByUserid(userId: string) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userId: userId
        }
      })

      return user
    } catch (e) {
      console.log(e)
    }
  }
}