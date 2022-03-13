import { Request, Response } from 'express'
import { Router } from 'express'
import MemberController from '../controller/member-controller'

class MemberRoutes {
	private router: Router
	private tipster: MemberController

	constructor() {
		this.router = Router()
		this.routes()
		this.tipster = new MemberController()
	}

	getRoute() {
		return this.router
	}

	private routes() {
		this.router.post('/signup/:id/:secret', async (req: Request, res: Response) => {
			await this.tipster.signup(req, res)
		})	
	}
}

export default new MemberRoutes
