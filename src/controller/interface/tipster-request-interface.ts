import { Request } from 'express'

export interface tipsterRequest extends Request {
  userId?: number
}
