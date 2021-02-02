import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

// This class represent both the GraphQL object type, and the db model
@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string

  @Field(() => String)
  @Column()
  title!: string

  @Field(() => String)
  @Column()
  author!: string

  @Field(() => Boolean)
  @Column({ default: false })
  isPublished: boolean
}
