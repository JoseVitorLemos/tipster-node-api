import express, { Application } from 'express'
import cors from 'cors'
import AuthAdminGuard from './auth/auth-adm-guard'
import AdmTipsterRoutes from './routes/create-tipster-route'
import TipsterRoutes from './routes/tipster-route'

class App {
	private app: Application

	constructor() {
		this.app = express()
		this.globalMiddleware()
		this.setupRoutes()
	}

	start(port: string | number) {
		return this.app.listen(port, () => console.log(`Server running at ${port}`))
	}

	bodyParse() {
	 	return this.app.use(express.json())
	}

	enableCors() {
		const allowedOrigins = process.env.LIST_HOST?.split(',')
		const options: cors.CorsOptions = {
			origin: allowedOrigins
		}

	 	return this.app.use(cors(options))
	}

	globalMiddleware() {
		this.enableCors()
		this.bodyParse()
	}

	setupRoutes() {
		this.app.get('/', async (_req, res) => {
			return res.status(200).send('Welcome to tipster api')
		})

		this.app.use('/api/dev/tipster', AuthAdminGuard, AdmTipsterRoutes.getRoute())
		this.app.use('/api/tipster', TipsterRoutes.getRoute())
	}
}

export default new App
