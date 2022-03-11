import bcrypt from 'bcrypt'

class Bcrypt {
	async compare(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword)
	}

	async hash(password: string): Promise<string> {
		return bcrypt.hash(password, 10)
	}
}

export default new Bcrypt
