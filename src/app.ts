import express, { Application } from 'express'
import cors from 'cors'
import AdmTipsterRoutes from './routes/create-tipster-route'
import { AuthAdminGuard } from './controller/auth-adm-guard'

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

		this.app.use('/api/tipster', AuthAdminGuard, AdmTipsterRoutes.getRoute())
	}
}

export default new App
