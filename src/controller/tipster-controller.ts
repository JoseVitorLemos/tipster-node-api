import knex from '../infra/database/connection'
import bcrypt from '../utils/bcrypt'
import { Request, Response } from 'express'
import jwt, { signinLoginToken, refreshToken } from '../utils/jwt-utils'
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

	  return new Promise((resolve, reject) => {
		  jwt.sign({ userId }, secret_key, {}, async (err, token) => {
        const invite = {
          secret_key, 
          created_at: new Date(),
          tipster_id: userId
        }

        const transaction = await knex.transaction()

		    const id = await transaction('invites').insert(invite).returning('id').then(prop => prop[0].id)

        const invite_link = `/api/member/signup/${id}/${token}`

		    await transaction('invites').where({ id }).update({ invite_link })

		    await transaction.commit()

			  if(err) {
				  console.log(err.message)
				  reject(new Error(err.message))
			  }
			  resolve(token)
	      return res.status(200).json({ invite_link })
		  })
	  })
	}

	async inviteLinks(req: userRequest, res: Response) {
	  const tipster_id = req.userId
	  const invites = await knex('invites').where({ tipster_id }).select()
	  if(invites) res.status(200).send(invites).end()
  }

	async findMembers(req: userRequest, res: Response) {
	  const tipster_id = req.userId
	  const invites = await knex('members').where({ tipster_id }).select()
	  if(invites) res.status(200).send(invites).end()
  }

	async memberActive(req: userRequest, res: Response) {
	  const tipster_id = req.userId
	  const { activity_status, member_id } = req.body

	  const member = await knex('members')
	    .where({ id: member_id, tipster_id })
	    .select().first()

    if(!member) return res.status(400).json({ statusCode: 400, message: 'This member was not found' })

		const [updatedMember] = 
		  await knex('members')
		  .where({ id: member_id })
		  .update({ activity_status, updated_at: new Date() })
		  .returning('*')

    delete updatedMember.password

		res.send(updatedMember)
  }
}
