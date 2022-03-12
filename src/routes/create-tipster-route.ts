import { Request, Response } from 'express'
import { Router } from 'express'
import AdmTipsterController from '../controller/adm-tipster-controller'

class AdmTipsterRoutes {
	private router: Router
	private tipster: AdmTipsterController

	constructor() {
		this.router = Router()
		this.routes()
		this.tipster = new AdmTipsterController()
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

export default new AdmTipsterRoutes
