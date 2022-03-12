import jwt from 'jsonwebtoken'

export async function signinLoginToken (id: number) {
	const privateKey = process.env.TOKEN!
  const accessToken = jwt.sign({ userId: id }, privateKey, { expiresIn: '1h' })
	return { auth: true, accessToken }
}

export async function refreshToken(id: string) {
  const userId = id.toString()
	return new Promise((resolve, reject) => {
		const secret = process.env.REFRESH_TOKEN as string
		const payload = {}

		const options = {
			expiresIn: '30d',
			audience: userId
		}

		jwt.sign(payload, secret, options, (err, token) => {
			if(err) {
				console.log(err.message)
				reject(new Error('Internal Server Error'))
			}
			resolve(token)
		})
	})
}

export async function verifyRefreshToken(refreshToken: string) {
	return new Promise((resolve, reject) => {
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string, (err, payload: any) => {
			if(err) {
				reject(err.message)
			}
			const userId = payload.aud
			resolve(userId)
		})
	})
}
