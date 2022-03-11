const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER , DATABASE_PASSWORD } = process.env

const config = {
	host: DATABASE_HOST,
	port: Number(DATABASE_PORT),
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	database: DATABASE_NAME
}

export default config
