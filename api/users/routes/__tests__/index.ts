import request from 'supertest'
import express, { Express } from 'express'
import { s3Buckets } from '../../../config/s3.config'
import { uploadFile } from '../../../utils/s3Upload'
import { HTTP_STATUS_CODES } from '../../../config/http.config'

import api from '../../../index'

jest.mock('../../../utils/s3Upload', () => ({
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

let app: Express

describe('User Routes', () => {
  beforeEach(() => {
    app = express()
    app.use('/api/users/profile/photo', (req, res, next) => {
      (req as any).isAuthenticated = mockIsAuthenticated
      next()
    })
    app.use('/api', api)
    jest.clearAllMocks()
  })

  afterEach(() => {
    mockIsAuthenticated.mockReturnValue(true)
  })

  it('should upload a profile photo successfully', async () => {
    const mockFile = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test file content'),
    }

    const response = await request(app)
      .post('/api/users/profile/photo')
      .attach('file', mockFile.buffer, mockFile.originalname)

    expect(response.status).toBe(HTTP_STATUS_CODES.OK)
    expect(response.text).toBe('File uploaded successfully.')
    expect(uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        originalname: mockFile.originalname,
        mimetype: mockFile.mimetype,
        buffer: mockFile.buffer,
      }),
      s3Buckets.PROFILE_PHOTOS
    )
  })

  it('should return an error if the user is not authenticated', async () => {
    mockIsAuthenticated.mockReturnValue(false)
    const mockFile = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test file content'),
    }

    const response = await request(app)
    .post('/api/users/profile/photo')
    .attach('file', mockFile.buffer, mockFile.originalname)

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED)
  })

  it('should return an error if no file is uploaded', async () => {
    const response = await request(app).post('/api/users/profile/photo')

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST)
    expect(response.text).toBe('No file uploaded.')
    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('should return an error if the uploaded file type is not supported', async () => {
    const mockFile = {
      originalname: 'document.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from('test file content'),
    }

    const response = await request(app)
      .post('/api/users/profile/photo')
      .attach('file', mockFile.buffer, mockFile.originalname)

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST)
    expect(response.text).toBe('File type not supported.')
    expect(uploadFile).not.toHaveBeenCalled()
  })
})
