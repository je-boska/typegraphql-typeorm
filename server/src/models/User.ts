import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Field()
  @Column({ unique: true, nullable: true })
  email!: string

  @Column()
  password!: string

  @Field()
  @Column({ nullable: true })
  about: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => [Post])
  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @Field(() => [User])
  @ManyToMany(() => User, user => user.follows)
  @JoinTable()
  follows: User[]
}
