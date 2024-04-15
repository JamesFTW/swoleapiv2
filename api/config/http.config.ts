interface MIME_TYPES {
  [key: string]: string
  'image/jpg': string
  'image/jpeg': string
  'image/png': string
}

export const MIME_TYPES: MIME_TYPES = {
  'image/jpg': 'image/jpg',
  'image/jpeg': 'image/jpeg',
  'image/png': 'image/png',
}

interface HTTP_STATUS_CODES {
  [key: string]: number
  OK: number
  OK_NOT_CONTENT: number
  BAD_REQUEST: number
  UNAUTHORIZED: number
  INTERNAL_SERVER_ERROR: number
}

export const HTTP_STATUS_CODES: HTTP_STATUS_CODES = {
  OK: 200,
  OK_NOT_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
}
