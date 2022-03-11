import { Request, Response } from 'express'
import { Router } from 'express'
import TipsterController from '../controller/tipster-controller'

class TipsterRoutes {
	private router: Router
	private tipster: TipsterController

	constructor() {
		this.router = Router()
		this.routes()
		this.tipster = new TipsterController()
	}

	getRoute() {
		return this.router
	}

	private routes() {
		this.router.post('/signup', async (req: Request, res: Response) => {
			await this.tipster.signup(req, res)
		})	
	}
}

export default new TipsterRoutes
