import { UsersServices } from '../services'
import { Users as UsersPrisma } from '@prisma/client'
import { Users } from '../models'

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
      // Mock data and dependencies
      const params = {
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'P@ssw0rd',
      }
      const salt = 'salt123'

      // Mock the create method of Users
      const createMock = jest
        .spyOn(usersModel, 'create')
        .mockImplementation(() => Promise.resolve())

      // Call the createUser method
      await usersServices.createUser(params, salt)

      // Expect the create method to have been called with the correct arguments
      expect(createMock).toHaveBeenCalledWith(
        params.userName,
        params.firstName,
        params.lastName,
        params.email,
        params.password,
        salt,
      )
    })

    it('should reject with an error if user creation fails', async () => {
      // Mock data and dependencies
      const params = {
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'P@ssw0rd',
      }
      const salt = 'salt123'

      // Mock the create method of Users to throw an error
      const createMock = jest
        .spyOn(usersModel, 'create')
        .mockImplementation(() => {
          throw new Error('Failed to create user')
        })

      // Call the createUser method and expect it to reject with an error
      await expect(usersServices.createUser(params, salt)).rejects.toThrowError(
        'Failed to create user',
      )
    })
  })

  describe('getByUserName', () => {
    it('should retrieve a user by email successfully', async () => {
      // Mock data and dependencies
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
        // Add other required properties here
      }

      // Mock the getByEmail method of Users
      const getByEmailMock = jest
        .spyOn(usersModel, 'getByEmail')
        .mockImplementation(async (email: string) =>
          Promise.resolve(user as UsersPrisma | null),
        )

      // Call the getByEmail method
      const result = await usersServices.getByEmail(email)

      // Expect the getByEmail method to have been called with the correct argument
      expect(getByEmailMock).toHaveBeenCalledWith(email)

      // Expect the result to be the retrieved user
      expect(result).toEqual(user)
    })

    it('should reject with an error if retrieval fails', async () => {
      // Mock data and dependencies
      const userName = 'john.doe'

      // Mock the getByUserName method of Users to throw an error
      const getByUserNameMock = jest
        .spyOn(usersModel, 'getByUserName')
        .mockImplementation(() => {
          throw new Error('Failed to retrieve user by username')
        })

      // Call the getByUserName method and expect it to reject with an error
      await expect(usersServices.getByUserName(userName)).rejects.toThrowError(
        'Failed to retrieve user by username',
      )
    })
  })

  describe('getByEmail', () => {
    it('should retrieve a user by email successfully', async () => {
      // Mock data and dependencies
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
        // Add other required properties here
      }

      // Mock the getByEmail method of Users
      const getByEmailMock = jest
        .spyOn(usersModel, 'getByEmail')
        .mockImplementation(async (email: string) =>
          Promise.resolve(user as UsersPrisma | null),
        )

      // Call the getByEmail method
      const result = await usersServices.getByEmail(email)

      // Expect the getByEmail method to have been called with the correct argument
      expect(getByEmailMock).toHaveBeenCalledWith(email)

      // Expect the result to be the retrieved user
      expect(result).toEqual(user)
    })
    it('should reject with an error if retrieval fails', async () => {
      // Mock data and dependencies
      const email = 'john.doe@example.com'

      // Mock the getByEmail method of Users to throw an error
      const getByEmailMock = jest
        .spyOn(usersModel, 'getByEmail')
        .mockImplementation(() => {
          throw new Error('Failed to retrieve user by email')
        })

      // Call the getByEmail method and expect it to reject with an error
      await expect(usersServices.getByEmail(email)).rejects.toThrowError(
        'Failed to retrieve user by email',
      )
    })
  })
})
