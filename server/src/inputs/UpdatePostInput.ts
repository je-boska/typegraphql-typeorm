import { InputType, Field } from 'type-graphql'

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  body?: string

  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  imageId?: string
}
