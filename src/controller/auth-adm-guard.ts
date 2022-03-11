import { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import bcrypt from 'bcrypt'

export function AuthAdminGuard(req: Request, res: Response, next: NextFunction) {
  const adm_pass = req.headers.authorization?.split(' ')[1] as string

  bcrypt.compare(adm_pass, process.env.ADM_KEY as string, (err, result) => {
	  if(err )return res.status(400).json({ statusCode: 400, message: 'Invalid adm password provided'})
	  next()
  })
}
