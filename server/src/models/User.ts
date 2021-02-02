import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string

  @Field(() => String)
  @Column()
  name!: string

  @Field(() => String)
  @Column({ unique: true })
  email!: string

  @Field(() => String)
  @Column()
  password!: string
}
