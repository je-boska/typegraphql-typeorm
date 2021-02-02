import { InputType, Field } from 'type-graphql'

@InputType()
export class LoginUserInput {
  @Field()
  email!: string

  @Field()
  password!: string
}
