import request from 'supertest'
import express, { Express } from 'express'
import api from '@api/index'
import { uploadFile } from '@api/utils/s3Utils'
import { HTTP_STATUS_CODES } from '@api/config/http.config'
import { Session, SessionData } from 'express-session'

jest.mock('@api/utils/s3Utils', () => ({
  uploadFile: jest.fn(),
}))

const mockIsAuthenticated = jest.fn(() => true)

jest.mock('buffer', () => {
  const actualBuffer = jest.requireActual('buffer')
  return {
    ...actualBuffer,
    Buffer: class MockBuffer extends actualBuffer.Buffer {
      constructor(arg: any) {
        super(arg)
      }
    },
  }
})

jest.mock('@api/users/services', () => {
  return {
    UsersServices: jest.fn().mockImplementation(() => ({
      updateProfilePhoto: jest.fn().mockResolvedValue(undefined),
      createEmailChain: jest.fn().mockReturnValue(jest.fn()),
      createUserChain: jest.fn().mockReturnValue(jest.fn()),
      createUserPasswordChain: jest.fn().mockReturnValue(jest.fn()),
      createUser: jest.fn().mockResolvedValue(undefined),
    })),
  }
})

let app: Express

describe('User Routes', () => {
  beforeEach(() => {
    app = express()
    app.use('/api/users/profile/update/photo', (req, res, next) => {
      ;(req as any).isAuthenticated = mockIsAuthenticated
      req.session = {
        passport: { userId: 'mockUserId', userName: 'bruh' },
      } as Session & Partial<SessionData>
      next()
    })
    app.use('/api', api)
    jest.clearAllMocks()
  })

  afterEach(() => {
    mockIsAuthenticated.mockReturnValue(true)
  })

  it('should return an error if the user is not authenticated', async () => {
    mockIsAuthenticated.mockReturnValue(false)
    const mockFile = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test file content'),
    }

    const response = await request(app)
      .post('/api/users/profile/update/photo')
      .attach('file', mockFile.buffer, mockFile.originalname)

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED)
  })

  it('should return success message for a successful file upload', async () => {
    const mockFile = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test file content'),
    }

    const response = await request(app)
      .post('/api/users/profile/update/photo')
      .attach('file', mockFile.buffer, mockFile.originalname)

    expect(response.status).toBe(HTTP_STATUS_CODES.OK)
    expect(response.text).toBe('File uploaded successfully.')
  })

  it('should return an error if the uploaded file type is not supported', async () => {
    const mockFile = {
      originalname: 'document.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from('test file content'),
    }

    const response = await request(app)
      .post('/api/users/profile/update/photo')
      .attach('file', mockFile.buffer, mockFile.originalname)

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST)
    expect(response.text).toBe('File type not supported.')
    expect(uploadFile).not.toHaveBeenCalled()
  })
})
