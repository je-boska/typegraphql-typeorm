import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { getRepository } from 'typeorm'
import { CreateBookInput } from '../inputs/CreateBookInput'
import { UpdateBookInput } from '../inputs/UpdateBookInput'
import { Book } from '../models/Book'
import { User } from '../models/User'

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books() {
    const bookRepo = getRepository(Book)
    const books = bookRepo.find({ relations: ['user'] })
    return books
  }

  @Query(() => Book)
  async book(@Arg('id') id: string) {
    const bookRepo = getRepository(Book)
    const book = await bookRepo.findOne({ where: { id }, relations: ['user'] })
    return book
  }

  @Mutation(() => Book)
  async createBook(
    @Arg('data') data: CreateBookInput,
    @Arg('userId') userId: string
  ) {
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error('No user with that ID')
    const book = Book.create(data)
    book.user = user
    await book.save()
    return book
  }

  @Mutation(() => Book)
  async updateBook(@Arg('id') id: string, @Arg('data') data: UpdateBookInput) {
    const book = await Book.findOne({ where: { id } })
    if (!book) throw new Error('Book not found')
    Object.assign(book, data)
    await book.save()
    return book
  }

  @Mutation(() => Boolean)
  async deleteBook(@Arg('id') id: string) {
    const book = await Book.findOne({ where: { id } })
    if (!book) throw new Error('Book not found')
    await book.remove()
    return true
  }
}
