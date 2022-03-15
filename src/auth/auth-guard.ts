import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { userRequest } from '../controller/interface/tipster-request-interface'

const AuthGuard = (req: userRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] as string
  const secret = process.env.TOKEN as string

	jwt.verify(token, secret, (err, decoded: any) => {
		if(err) { 
			console.log(err)
      return res.status(401).json({ statusCode: 401, message: err.message })
		}

		req.userId = decoded.userId
		next()
	})
}

export default AuthGuard
