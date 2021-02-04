import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Post } from './Post'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string

  @Field()
  @Column()
  name!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Field(() => [Post])
  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @Field(() => [User])
  @ManyToMany(() => User, user => user.follows)
  @JoinTable()
  follows: User[]
}
