import 'reflect-metadata'
import 'dotenv/config'
import { createConnection } from 'typeorm'
import path from 'path'
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
    url: `${process.env.DATABASE_URL}sslmode=require`,
    entities: ['./src/models/*.ts'],
    synchronize: true,
    logging: true,
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

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/web/build')))

    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'web', 'build', 'index.html'))
    )
  } else {
    app.get('/', (req, res) => {
      res.send('API is running....')
    })
  }

  server.applyMiddleware({ app, cors: false })

  app.listen(4000)
  console.log('Server is running on port 4000')
}

main()
