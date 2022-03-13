import { Request } from 'express'

export interface userRequest extends Request {
  userId?: number
}
