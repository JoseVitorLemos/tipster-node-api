import { Request, Response } from 'express'
import { Router } from 'express'
import MemberController from '../controller/member-controller'

class MemberRoutes {
	private router: Router
	private member: MemberController

	constructor() {
		this.router = Router()
		this.routes()
		this.member = new MemberController()
	}

	getRoute() {
		return this.router
	}

	private routes() {
		this.router.post('/signup/:id/:secret', async (req: Request, res: Response) => {
			await this.member.signup(req, res)
		})	

		this.router.post('/login', async (req: Request, res: Response) => {
			await this.member.login(req, res)
		})	
	}
}

export default new MemberRoutes
