import { InputType, Field } from 'type-graphql'

@InputType()
export class RegisterUserInput {
  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  about?: string

  @Field({ nullable: true })
  avatar?: string

  @Field({ nullable: true })
  avatarId?: string

  @Field()
  password: string
}
