import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

const AuthAdminGuard = (req: Request, res: Response, next: NextFunction) => {
  const adm_pass = req.headers.authorization?.split(' ')[1] as string

  bcrypt.compare(adm_pass, process.env.ADM_KEY as string, (err, validate) => {
	  if(!validate)return res.status(400).json({ statusCode: 400, message: 'Invalid adm password provided'})
	  next()
  })
}

export default AuthAdminGuard
