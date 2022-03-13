import knex from '../infra/database/connection'
import bcrypt from '../utils/bcrypt'
import { Request, Response } from 'express'
import { signinLoginToken, refreshToken } from '../utils/jwt-utils'

export default class TipsterController {
	async signup(req: Request, res: Response) {
		const { id, secret } = req.params

		const tipster = 
		  await knex('invites')
		  .where('tipster_id', id)

		let inviteId

    const validate = 
      await Promise.all(tipster.map(async invite => {
        if(await bcrypt.compare(invite.secret_key, secret)) {
          inviteId = invite.id
          return true
        }
        return false
      }))

    if(validate.includes(true)) {
      const { user_name, password, first_name, last_name, telegram, email, whatsapp, birth_date }	= req.body

		  const hashedPassword = await bcrypt.hash(password)

		  const newMember = {
		    user_name,
        first_name, 
        last_name, 
			  password: hashedPassword,
        telegram, 
        email, 
        whatsapp,
        birth_date: birth_date,
        tipster_id: id,
			  created_at: new Date()
		  }

		  const findUserName = await knex('members').where({ user_name }).first()
		  const findEmail = await knex('members').where({ email }).first()

		  if(findUserName || findEmail) { 
        const text = findUserName ? 'name' : 'email' 
		    return res.status(400).json({ statusCode: 400, message: `User ${text} already registered` }).end()
		  }

	    try {
        const transaction = await knex.transaction()

		    const id = await transaction('members')
		      .insert(newMember)
		      .returning('id')
		      .then(prop => prop[0].id)

		    const member = 
		      await transaction('members')
		      .where({ user_name })
		      .from('members as m')
		      .select('m.id', 'm.user_name', 'm.first_name', 'm.last_name', 'm.telegram', 'm.email', 'm.whatsapp', 'm.created_at', 'm.birth_date')
		      .first()

		    await transaction('invites').where('id', inviteId).del()

				await transaction.commit()

        const accessT = await signinLoginToken(id) 
        const refreshT = await refreshToken(id) 

		    return res.status(200).json({ member, ...accessT, refreshToken: refreshT }).end()
      } catch (err) {
	      console.log(err)
		    return res.status(500).json({ statusCode: 500, message: 'Internal Server Error'})
	    }
	  } else {
		  return res.status(400).json({ statusCode: 400, message: 'Invitation link not found' })
		}
  }
}
