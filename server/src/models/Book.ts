import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { User } from './User'

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  author!: string

  @Field()
  @Column({ default: false })
  isPublished!: boolean

  @Field()
  @ManyToOne(() => User, user => user.books)
  user: User
}
