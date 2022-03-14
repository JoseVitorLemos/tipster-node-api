import { Request, Response } from 'express'
import { Router } from 'express'
import TipsterController from '../controller/tipster-controller'
import { userRequest } from '../controller/interface/tipster-request-interface'
import AuthGuard from '../auth/auth-guard'

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

    this.router.get('/register-link', AuthGuard, async (req: userRequest, res: Response): Promise<void> => {
			await this.tipster.registerLink(req, res)
		})

    this.router.get('/invite-links', AuthGuard, async (req: userRequest, res: Response): Promise<void> => {
			await this.tipster.inviteLinks(req, res)
		})

  this.router.get('/members', AuthGuard, async (req: userRequest, res: Response): Promise<void> => {
			await this.tipster.findMembers(req, res)
		})
	}
}

export default new TipsterRoutes
