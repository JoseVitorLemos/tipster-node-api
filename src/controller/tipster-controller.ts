import knex from '../infra/database/connection'
import bcrypt from '../utils/bcrypt'
import { Request, Response } from 'express'

export default class TipsterController {
	async signup(req: Request, res: Response) {
		const { userName, password, fullName, telegram, email, whatsapp }	= req.body

		const hashedPassword = await bcrypt.hash(password)

		const newUser = {
      userName, 
			password: hashedPassword,
      fullName, 
      telegram, 
      email, 
      whatsapp,
			createdAt: new Date()
		}

		const findUserName = await knex('tipster').where({ userName }).first()
		const findEmail = await knex('tipster').where({ email }).first()

		if(findUserName || findEmail) { 
      const text = findUserName ? 'name' : 'email' 
		  return res.status(400).json({ statusCode: 400, message: `User ${text} already registered` }).end()
		}

	  try {
		  const id = await knex('tipster').insert(newUser).returning('id').then(prop => prop[0].id)

		  const tipster = 
		    await knex('tipster')
		    .where({ id })
		    .from('tipster as t')
		    .select('t.id', 't.userName', 't.fullName', 't.telegram', 't.email', 't.whatsapp', 't.createdAt')
		    .first()

		  return res.status(200).json({ ...tipster })
    } catch (err) {
	    console.log(err)
		  return res.status(500).json({ statusCode: 500, message: 'Internal Server Error'})
	  }
	} 
}
