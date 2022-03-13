import { Request, Response } from 'express'
import { Router } from 'express'
import TipsterController from '../controller/tipster-controller'
import { tipsterRequest } from '../controller/interface/tipster-request-interface'

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
		this.router.post('/login', async (req: Request, res: Response) => {
			await this.tipster.login(req, res)
		})	

    this.router.get('/register-link', async (req: tipsterRequest, res: Response): Promise<void> => {
			await this.tipster.registerLink(req, res)
		})
	}
}

export default new TipsterRoutes
