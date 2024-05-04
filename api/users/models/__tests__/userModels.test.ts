import { UsersServices } from '../../services/UserServices'
import { Users as UsersPrisma } from '@prisma/client'
import { Users } from '../Users'

describe('UsersServices', () => {
  let usersServices: UsersServices
  let usersModel: Users

  beforeEach(() => {
    usersModel = new Users()
    usersServices = new UsersServices(usersModel)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const params = {
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'P@ssw0rd',
        profilePhoto: 'photo.jpg',
      }
      const salt = 'salt123'

      const createMock = jest
        .spyOn(usersModel, 'create')
        .mockImplementation(() => Promise.resolve())

      await usersServices.createUser(params, salt)

      expect(createMock).toHaveBeenCalledWith(
        params.userName,
        params.firstName,
        params.lastName,
        params.email,
        params.password,
        params.profilePhoto,
        salt,
      )
    })

    it('should reject with an error if user creation fails', async () => {
      const params = {
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'P@ssw0rd',
        profilePhoto: 'photo.jpg',
      }
      const salt = 'salt123'

      const createMock = jest
        .spyOn(usersModel, 'create')
        .mockImplementation(() => {
          throw new Error('Failed to create user')
        })

      await expect(usersServices.createUser(params, salt)).rejects.toThrowError(
        'Failed to create user',
      )
    })
  })

  describe('getByUserName', () => {
    it('should retrieve a user by email successfully', async () => {
      const email = 'john.doe@example.com'
      const user = {
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profilePhoto: 'photo.jpg',
        bio: 'Lorem ipsum',
        salt: 'salt123',
        userId: '123456',
      }

      const getByEmailMock = jest
        .spyOn(usersModel, 'getByEmail')
        .mockImplementation(async (email: string) =>
          Promise.resolve(user as UsersPrisma | null),
        )

      const result = await usersServices.getByEmail(email)

      expect(getByEmailMock).toHaveBeenCalledWith(email)

      expect(result).toEqual(user)
    })

    it('should reject with an error if retrieval fails', async () => {
      const userName = 'john.doe'

      const getByUserNameMock = jest
        .spyOn(usersModel, 'getByUserName')
        .mockImplementation(() => {
          throw new Error('Failed to retrieve user by username')
        })

      await expect(usersServices.getByUserName(userName)).rejects.toThrowError(
        'Failed to retrieve user by username',
      )
    })
  })

  describe('getByEmail', () => {
    it('should retrieve a user by email successfully', async () => {
      const email = 'john.doe@example.com'
      const user = {
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profilePhoto: 'photo.jpg',
        bio: 'Lorem ipsum',
        salt: 'salt123',
        userId: '123456',
      }

      const getByEmailMock = jest
        .spyOn(usersModel, 'getByEmail')
        .mockImplementation(async (email: string) =>
          Promise.resolve(user as UsersPrisma | null),
        )

      const result = await usersServices.getByEmail(email)

      expect(getByEmailMock).toHaveBeenCalledWith(email)

      expect(result).toEqual(user)
    })
    it('should reject with an error if retrieval fails', async () => {
      const email = 'john.doe@example.com'

      const getByEmailMock = jest
        .spyOn(usersModel, 'getByEmail')
        .mockImplementation(() => {
          throw new Error('Failed to retrieve user by email')
        })

      await expect(usersServices.getByEmail(email)).rejects.toThrowError(
        'Failed to retrieve user by email',
      )
    })
  })
})
