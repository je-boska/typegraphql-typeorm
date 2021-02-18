import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  Int,
} from 'type-graphql'
import { getConnection, getRepository } from 'typeorm'
import { CreatePostInput } from '../inputs/CreatePostInput'
import { UpdatePostInput } from '../inputs/UpdatePostInput'
import { isAuth } from '../middleware/isAuth'
import { Post } from '../models/Post'
import { User } from '../models/User'
import { ContextType, UploadType } from '../types'
import { verifyToken } from '../utils/verifyToken'

import cloudinary from 'cloudinary'
import { GraphQLUpload } from 'apollo-server-express'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Ctx() { req }: ContextType,
    @Arg('offset', () => Int, { nullable: true }) offset: number | null
  ) {
    const token = req.headers.authorization?.split(' ')[1] || ''
    const id = verifyToken(token)

    const sqlArgs: any[] = [id]

    if (offset) {
      sqlArgs.push(offset)
    }

    const posts = await getConnection().query(
      `
    SELECT p.*, u.name 
    FROM post p
    JOIN "user" AS u ON "userId" = u.id
    WHERE "userId" IN (
      SELECT "userId_2" 
      FROM user_follows_user 
      WHERE "userId_1" = $1)
    OR "userId" = $1
    ORDER BY "createdAt" DESC
    ${offset ? 'OFFSET $2 ROWS' : ''}
    LIMIT 5;
      `,
      sqlArgs
    )
    return posts
  }

  @Query(() => Post)
  async post(@Arg('id') id: string) {
    const postRepo = getRepository(Post)
    const post = await postRepo.findOne({ where: { id }, relations: ['user'] })
    return post
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Arg('userId') userId: string
  ) {
    const post = Post.create(data)
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error('No user with that ID')
    post.user = user
    await post.save()
    return post
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async updatePost(@Arg('id') id: string, @Arg('data') data: UpdatePostInput) {
    const post = await Post.findOne({ where: { id } })
    if (!post) throw new Error('Post not found')
    Object.assign(post, data)
    await post.save()
    return post
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg('id') id: string) {
    const post = await Post.findOne({ where: { id } })
    if (!post) throw new Error('Post not found')
    await post.remove()
    return true
  }

  @Mutation(() => Boolean)
  async uploadPhoto(
    @Arg('photo', () => GraphQLUpload!) photo: UploadType
  ): Promise<Boolean> {
    console.log(photo)

    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        allowed_formats: ['jpg', 'png'],
        public_id: '',
        folder: 'MRL',
      },
      function (error: any, result: any) {
        if (result) {
          console.log('result', result)
        } else {
          console.log('error', error)
        }
      }
    )

    const { createReadStream } = photo

    const fileStream = createReadStream()

    fileStream.pipe(uploadStream)

    return true
  }
}
