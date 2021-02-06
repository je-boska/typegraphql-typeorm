import jwt from 'jsonwebtoken'

type VerifiedUserType = {
  id: string
}

export const verifyToken = (token: string) => {
  const verifiedUser = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as VerifiedUserType
  return verifiedUser.id
}
