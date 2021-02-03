import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Book } from './Book'

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
  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Field(() => [Book])
  @OneToMany(() => Book, book => book.user)
  books: Book[]
}
