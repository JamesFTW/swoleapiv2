import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@middleware/(.*)$': '<rootDir>/api/middleware/$1',
  },
}

export default config
