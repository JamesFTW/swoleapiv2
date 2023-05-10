import { PrismaClient, Users as PrismaUsers } from '@prisma/client'
const prisma = new PrismaClient()

declare global {
  namespace Express {
    interface User {
      userId: string,
      userName: string,
    }
  }
}

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
    salt: string,
  ): Promise<void> {
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
    } catch (error) {
      throw new Error(
        `An error occurred while creating a new user: ${(error as Error).message}`
      )
    }
  }

  async getByUserName(userName: string): Promise<PrismaUsers | null> {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userName: userName
        }
      })
      return user

    } catch (error) {
      throw new Error(
        `An error occurred while fetching the userName: ${(error as Error).message}`
      )
    }
  }

  async getByUserid(userId: string): Promise<PrismaUsers | null> {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userId: userId
        }
      })
      return user

    } catch (error) {
      throw new Error(
        `An error occurred while fetching the userid: ${(error as Error).message}`
      )
    }
  }
}