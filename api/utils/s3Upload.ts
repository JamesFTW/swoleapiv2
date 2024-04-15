import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { config } from '../config/aws.config'

const client = new S3Client(config)

export const uploadFile = async (
  file: Express.Multer.File | undefined,
  bucketName: string | undefined,
) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: file?.originalname,
    Body: file?.buffer,
    ContentType: file?.mimetype,
    ACL: 'public-read',
  })

  await client.send(command)
}
