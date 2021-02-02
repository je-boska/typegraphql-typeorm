import jwt from 'jsonwebtoken'

const generateToken = (id: string) => {
  const secret: string = process.env.JWT_SECRET!
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  })
}

export default generateToken
