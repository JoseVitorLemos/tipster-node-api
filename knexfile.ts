import path from 'path'
import config from './src/infra/database/config'

module.exports = {    
	client: 'pg',
	connection: config,
	migrations: {
		directory: path.resolve(__dirname, 'src', 'infra', 'migrations')
	},
	seeds: {
		directory: path.resolve(__dirname, 'src', 'infra', 'seeds')
	},
	useNullAsDefault: true
}
