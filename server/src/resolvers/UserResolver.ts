import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { RegisterUserInput } from '../inputs/RegisterUserInput'
import { User } from '../models/User'
import argon2 from 'argon2'
import { LoginUserInput } from '../inputs/LoginUserInput'
import { generateToken } from '../utils/generateToken'
import { verifyToken } from '../utils/verifyToken'
import { ContextType } from '../types'
import { isAuth } from '../middleware/isAuth'

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => String, { nullable: true })
  token?: string
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  async me(@Ctx() { req }: ContextType) {
    const token = req.headers.authorization?.split(' ')[1] || ''
    const id = verifyToken(token)
    const user = await User.findOne(
      { id },
      {
        relations: [
          'posts',
          'posts.user',
          'follows',
          'follows.posts',
          'follows.posts.user',
        ],
      }
    )
    return user
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
  async users() {
    return User.find({ relations: ['follows', 'posts'] })
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async user(@Arg('id') id: string) {
    const user = await User.findOne({ id }, { relations: ['follows'] })
    if (!user) throw new Error('No user with this ID')
    return user
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async follow(
    @Arg('userId') userId: string,
    @Arg('friendId') followId: string
  ) {
    const user = await User.findOne({ id: userId }, { relations: ['follows'] })
    const followUser = await User.findOne({ id: followId })
    if (!user || !followUser) throw new Error('No user with this ID')
    user.follows = user.follows.concat(followUser)
    await user.save()
    return true
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async unfollow(
    @Arg('userId') userId: string,
    @Arg('friendId') followId: string
  ) {
    const user = await User.findOne({ id: userId }, { relations: ['follows'] })
    const followUser = await User.findOne({ id: followId })
    if (!user || !followUser) throw new Error('No user with this ID')
    user.follows = user.follows.filter(u => u.id !== followUser.id)
    await user.save()
    return true
  }

  @Mutation(() => UserResponse)
  async register(@Arg('data') data: RegisterUserInput) {
    const hashedPassword = await argon2.hash(data.password)
    let user
    let token
    try {
      user = User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      await user.save()
      token = generateToken(user.id)
    } catch (err) {
      if (err.code === '23505' || err.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        }
      }
    }
    return { user, token }
  }

  @Mutation(() => UserResponse)
  async login(@Arg('data') data: LoginUserInput) {
    const user = await User.findOne(
      { email: data.email },
      { relations: ['follows'] }
    )
    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Invalid Email',
          },
        ],
      }
    }
    const verified = await argon2.verify(user.password, data.password)
    if (!verified) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect Password',
          },
        ],
      }
    }

    const token = generateToken(user.id)
    return { user, token }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: any) {
    return false
  }
}
