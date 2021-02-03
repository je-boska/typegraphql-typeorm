import 'reflect-metadata'
import 'dotenv-safe/config'
import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { BookResolver } from './resolvers/BookResolver'
import { UserResolver } from './resolvers/UserResolver'
import { Book } from './models/Book'

async function main() {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['./src/models/*.ts'],
    synchronize: true,
    logging: true,
  })

  // await Book.delete({})

  const schema = await buildSchema({
    resolvers: [BookResolver, UserResolver],
  })

  const server = new ApolloServer({
    schema,
  })

  await server.listen(4000)
  console.log('Server is running on port 4000')
}

main()
