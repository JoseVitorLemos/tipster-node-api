import knex from '../infra/database/connection'
import bcrypt from '../utils/bcrypt'
import { Request, Response } from 'express'
import { signinLoginToken, refreshToken } from '../utils/jwt-utils'
import { userRequest } from './interface/tipster-request-interface'

export default class TipsterController {
	async login(req: Request, res: Response) {
		const { user_name, email, password }	= req.body

    const condition = user_name ? { user_name } : { email }

		const tipster = 
		  await knex('tipsters')
		  .where(condition)
		  .select('tipsters.id', 'tipsters.password')
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

	async registerLink(req: userRequest, res: Response) {
	  const { userId } = req

	  const secret_key = await bcrypt.genSaltSync()
	  const hash = await bcrypt.hash(secret_key)
    const invite_link = `http://localhost:4000/api/member/signup/${userId}/${hash}`

    try {
      const invite = {
        secret_key, 
        invite_link, 
        created_at: new Date(),
        tipster_id: userId
      }

		  await knex('invites').insert(invite)

	    res.status(200).json({ invite_link })
	  } catch (err) {
	    console.error (err)
      return res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
	  }
	}
}
