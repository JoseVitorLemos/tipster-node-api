import knex from 'knex'
import config from './config'

const connection = knex({ 
	client: 'pg',
	connection: config,
	useNullAsDefault: true
})

export default connection
