import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { config } from '../config/aws.config'

const client = new S3Client(config)

export const uploadFile = async (file: Express.Multer.File, bucketName: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: file?.originalname,
    Body: file?.buffer,
    ContentType: file?.mimetype,
    ACL: 'public-read',
  })

  await client.send(command)
}

export const deleteFile = async (bucketName: string, key: string | undefined) => {
  if (!key) return

  try {
    const data = await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }))
    return data
  } catch (err) {
    console.log('Error', err)
  }
}
