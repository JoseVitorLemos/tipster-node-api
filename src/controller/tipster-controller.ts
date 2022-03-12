import knex from '../infra/database/connection'
import bcrypt from '../utils/bcrypt'
import { Request, Response } from 'express'
import { signinLoginToken, refreshToken } from '../utils/jwt-utils'

export default class TipsterController {
	async login(req: Request, res: Response) {
		const { userName, email, password }	= req.body

    const condition = userName ? { userName } : { email }

		const tipster = 
		  await knex('tipster')
		  .where(condition)
		  .select('tipster.id', 'tipster.password')
		  .first()

		if(!tipster) return res.status(400).json({ statusCode: 400, message: 'Invalid login or password provided' }).end()

		const validate = await bcrypt.compare(password, tipster.password)

		if(validate) {
      const id = tipster.id

      const token = await signinLoginToken(id)
      const refresh = await refreshToken(id)

      res.status(200).send({ ...token, refreshToken: refresh })

		} else {
		  res.status(400).json({ statusCode: 400, message: 'Invalid password' })
		}
	} 
}
