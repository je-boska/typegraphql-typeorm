import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql'
import { RegisterUserInput } from '../inputs/RegisterUserInput'
import { User } from '../models/User'
import argon2 from 'argon2'
import { LoginUserInput } from '../inputs/LoginUserInput'
import generateToken from '../utils/generateToken'

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
  @Mutation(() => UserResponse)
  async register(@Arg('data') data: RegisterUserInput) {
    const hashedPassword = await argon2.hash(data.password)
    let user
    try {
      user = User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      await user.save()
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

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(@Arg('data') data: LoginUserInput) {
    const user = await User.findOne({ email: data.email })
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
}
