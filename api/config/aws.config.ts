import dotenv from 'dotenv'
dotenv.config()

const AWS_REGIONS = {
  US_EAST_N_VIRGINIA: 'us-east-1',
  US_EAST_OHIO: 'us-east-2',
  US_WEST_N_CALIFORNIA: 'us-west-1',
  US_WEST_OREGON: 'us-west-2',
}

export const config = {
  region: AWS_REGIONS.US_WEST_N_CALIFORNIA,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
}
