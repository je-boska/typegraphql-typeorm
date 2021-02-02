import './App.css'
import React, { useEffect, useState } from 'react'
import {
  useBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} from './generated/graphql'
import {
  Flex,
  Box,
  Text,
  Heading,
  Container,
  useColorMode,
  IconButton,
} from '@chakra-ui/react'
import { BookForm } from './components/BookForm'
import { Book } from './components/Book'
import { BookType } from './types'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

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
  const { colorMode, toggleColorMode } = useColorMode()

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
      <Heading size='4xl' m={8} mb={2} opacity='0.1'>
        /||
      </Heading>
      <Box>
        <IconButton
          aria-label='Change color mode'
          onClick={toggleColorMode}
          bgColor='transparent'
          float='right'
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
        <br />
        <Flex justify='center' direction='row-reverse'>
          <Box m={8}>
            {books.map(book => (
              <Book
                key={book.id}
                book={book}
                deleteBook={deleteBookHandler}
                selectBook={selectBookHandler}
              />
            ))}
          </Box>
          <Box>
            {!updateId && (
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
            )}
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
      </Box>
    </Container>
  )
}

export default App
