import knex from '../infra/database/connection'
import bcrypt from '../utils/bcrypt'
import { Request, Response } from 'express'

export default class AdmTipsterController {
	async signup(req: Request, res: Response) {
		const { user_name, password, first_name, last_name, telegram, email, whatsapp, birth_date }	= req.body

		const hashedPassword = await bcrypt.hash(password)

		const newTipster = {
		  user_name,
      first_name, 
      last_name, 
			password: hashedPassword,
      telegram, 
      email, 
      whatsapp,
      birth_date: birth_date,
			created_at: new Date()
		}

		const findUserName = await knex('tipsters').where({ user_name }).first()
		const findEmail = await knex('tipsters').where({ email }).first()

		if(findUserName || findEmail) { 
      const text = findUserName ? 'name' : 'email' 
		  return res.status(400).json({ statusCode: 400, message: `User ${text} already registered` }).end()
		}

	  try {
		  const id = await knex('tipsters').insert(newTipster).returning('id').then(prop => prop[0].id)

		  const tipster = 
		    await knex('tipsters')
		    .where({ id })
		    .from('tipsters as t')
		    .select('t.id', 't.user_name', 't.first_name', 't.last_name', 't.telegram', 't.email', 't.whatsapp', 't.created_at', 't.birth_date')
		    .first()

		  return res.status(200).json({ ...tipster })
    } catch (err) {
	    console.log(err)
		  return res.status(500).json({ statusCode: 500, message: 'Internal Server Error'})
	  }
	} 
}
