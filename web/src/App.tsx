import './App.css'
import { useEffect, useState } from 'react'
import {
  useBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} from './generated/graphql'
import { Flex, Box, Text, Heading, Container } from '@chakra-ui/react'
import { BookForm } from './components/BookForm'
import { Book } from './components/Book'
import { BookType } from './types'

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [updateId, setUpdateId] = useState('')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateAuthor, setUpdateAuthor] = useState('')
  const [updateIsPublished, setUpdateIsPublished] = useState(false)
  const [books, setBooks] = useState<BookType[]>([])
  const { data } = useBooksQuery()
  const [createBook] = useCreateBookMutation()
  const [updateBook] = useUpdateBookMutation()
  const [deleteBook] = useDeleteBookMutation()

  async function handleSubmit() {
    const { data: bookData } = await createBook({
      variables: { data: { title, author, isPublished } },
    })
    if (bookData) {
      setBooks(books.concat(bookData.createBook))
    }
    resetAddForm()
  }

  async function handleUpdateSubmit() {
    await updateBook({
      variables: {
        id: updateId,
        data: {
          title: updateTitle,
          author: updateAuthor,
          isPublished: updateIsPublished,
        },
      },
    })

    updateBookInState()
    resetUpdateForm()
  }

  function updateBookInState() {
    const bookIndex = books.findIndex(book => book.id === updateId)
    const newBooks = [...books]
    newBooks[bookIndex] = {
      ...newBooks[bookIndex],
      title: updateTitle,
      author: updateAuthor,
      isPublished: updateIsPublished,
    }
    setBooks(newBooks)
  }

  function resetAddForm() {
    setTitle('')
    setAuthor('')
    setIsPublished(false)
  }

  function resetUpdateForm() {
    setUpdateId('')
    setUpdateTitle('')
    setUpdateAuthor('')
    setUpdateIsPublished(false)
  }

  function deleteBookHandler(id: string) {
    deleteBook({ variables: { id } })
    setBooks(books.filter(book => book.id !== id))
    resetUpdateForm()
  }

  function selectBookHandler(book: BookType) {
    const { id, title, author, isPublished } = book
    setUpdateId(id)
    setUpdateTitle(title)
    setUpdateAuthor(author)
    setUpdateIsPublished(isPublished)
  }

  useEffect(() => {
    data && setBooks(data.books)
  }, [data])

  if (!data) {
    return (
      <Box m={8}>
        <Text>Loading...</Text>
      </Box>
    )
  }

  return (
    <Container maxWidth='100%' centerContent>
      <Heading size='3xl' m={8}>
        Bookshelf
      </Heading>
      <Flex justify='center'>
        <Box width='50%' m={8}>
          {books.map(book => (
            <Book
              book={book}
              deleteBook={deleteBookHandler}
              selectBook={selectBookHandler}
            />
          ))}
        </Box>
        <Box>
          <BookForm
            heading='Add Book'
            onSubmit={handleSubmit}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
          />
          {updateId && (
            <BookForm
              heading='Update Book'
              onSubmit={handleUpdateSubmit}
              cancel={resetUpdateForm}
              title={updateTitle}
              setTitle={setUpdateTitle}
              author={updateAuthor}
              setAuthor={setUpdateAuthor}
              isPublished={updateIsPublished}
              setIsPublished={setUpdateIsPublished}
            />
          )}
        </Box>
      </Flex>
    </Container>
  )
}

export default App
