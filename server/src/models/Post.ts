import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { User } from './User'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  body!: string

  @Field()
  @Column()
  image: string

  @Field()
  @Column()
  imageId: string

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  user: User

  @Field()
  name: string

  @Field()
  userId: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
