import { PrismaClient, Users as User } from '@prisma/client'
const prisma = new PrismaClient()

declare global {
  namespace Express {
    interface User {
      userId: string
      userName: string
    }
  }
}

export interface UserPayload {
  userName: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  profilePhoto: string
  bio?: string
}

export interface UserUpdateData {
  firstName?: string
  lastName?: string
  profilePhoto?: string
  bio?: string
  cacheExpiry?: string
}

export const userUpdateDataObj: Record<keyof UserUpdateData, any> = {
  firstName: 'string',
  lastName: 'string',
  profilePhoto: 'string',
  bio: 'string',
  cacheExpiry: 'string',
}

export class Users {
  async create(
    userName: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string,
    password: string,
    profilePhoto: string | undefined,
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
          profilePhoto,
          salt,
        },
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getByUserName(userName: string): Promise<User | null> {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userName: userName,
        },
      })
      return user
    } catch (error) {
      throw new Error(`An error occurred while fetching the userName: ${(error as Error).message}`)
    }
  }

  async getByUserid(userId: string): Promise<User | null> {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userId: userId,
        },
      })
      return user
    } catch (error) {
      throw new Error(`An error occurred while fetching the userid: ${(error as Error).message}`)
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      })
      return user
    } catch (error) {
      throw new Error(`An error occurred while fetching the userid: ${(error as Error).message}`)
    }
  }

  async updateProfile(userId: string, data: UserUpdateData): Promise<void> {
    try {
      await prisma.users.update({
        where: {
          userId: userId,
        },
        data: {
          ...data,
        },
      })
    } catch (error) {
      throw new Error(`An error occurred while updating the profile: ${(error as Error).message}`)
    }
  }

  async updateProfilePhoto(userId: string, profilePhoto: string): Promise<void> {
    try {
      await prisma.users.update({
        where: {
          userId: userId,
        },
        data: {
          profilePhoto: profilePhoto,
        },
      })
    } catch (error) {
      throw new Error(
        `An error occurred while updating the profile photo: ${(error as Error).message}`,
      )
    }
  }
}
