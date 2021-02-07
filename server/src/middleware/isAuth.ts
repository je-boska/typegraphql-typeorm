import { MiddlewareFn } from 'type-graphql'
import { ContextType } from '../types'
import { verifyToken } from '../utils/verifyToken'

export const isAuth: MiddlewareFn<ContextType> = ({ context }, next) => {
  const token = context.req.headers.authorization?.split(' ')[1] || ''
  const id = verifyToken(token)
  if (!context.req.headers.authorization || !id) {
    throw new Error('not authenticated')
  }

  return next()
}
