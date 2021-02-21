import 'reflect-metadata'
import 'dotenv-safe/config'
import { createConnection } from 'typeorm'
import express from 'express'
import cors from 'cors'
import cloudinary from 'cloudinary'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/PostResolver'
import { UserResolver } from './resolvers/UserResolver'
import { UploadResolver } from './resolvers/UploadResolver'

async function main() {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['./src/models/*.ts'],
    synchronize: true,
    // logging: true,
  })

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const app = express()
  app.use(cors())

  const schema = await buildSchema({
    resolvers: [PostResolver, UserResolver, UploadResolver],
  })

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  })

  server.applyMiddleware({ app, cors: false })

  app.listen(4000)
  console.log('Server is running on port 4000')
}

main()
