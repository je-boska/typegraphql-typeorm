import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { getRepository } from 'typeorm'
import { CreatePostInput } from '../inputs/CreatePostInput'
import { UpdatePostInput } from '../inputs/UpdatePostInput'
import { isAuth } from '../middleware/isAuth'
import { Post } from '../models/Post'
import { User } from '../models/User'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts() {
    const postRepo = getRepository(Post)
    const posts = postRepo.find({ relations: ['user'] })
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
}
