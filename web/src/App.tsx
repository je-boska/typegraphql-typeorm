import './App.css'
import { useEffect, useState } from 'react'
import {
  useBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
} from './generated/graphql'
import {
  Flex,
  Box,
  Text,
  Heading,
  Input,
  FormLabel,
  Button,
  Checkbox,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

type Book = {
  id: string
  title: string
  author: string
  isPublished: boolean
}

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [updateId, setUpdateId] = useState('')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateAuthor, setUpdateAuthor] = useState('')
  const [updateIsPublished, setUpdateIsPublished] = useState(false)
  const [books, setBooks] = useState<Book[]>()
  const { data } = useBooksQuery()
  const [createBook] = useCreateBookMutation()
  const [deleteBook] = useDeleteBookMutation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { data: bookData } = await createBook({
      variables: { data: { title, author, isPublished } },
    })
    if (bookData) {
      setBooks(books?.concat(bookData.createBook))
    }
    resetForm()
  }

  function resetForm() {
    setTitle('')
    setAuthor('')
    setIsPublished(false)
  }

  function deleteBookHandler(id: string) {
    deleteBook({ variables: { id } })
    setBooks(books?.filter(book => book.id !== id))
  }

  function selectBookHandler(book: Book) {
    const { id, title, author, isPublished } = book
    setUpdateId(id)
    setUpdateTitle(title)
    setUpdateAuthor(author)
    setUpdateIsPublished(isPublished)
  }

  useEffect(() => {
    setBooks(data?.books)
  }, [data])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <Flex justify='center'>
      <Box width='50%' m={8}>
        {books?.map(book => (
          <Flex key={book.id}>
            <Button m='20px' onClick={() => deleteBookHandler(book.id)}>
              <DeleteIcon />
            </Button>
            <Box width='500px' paddingBottom='30px'>
              <Heading onClick={() => selectBookHandler(book)} cursor='pointer'>
                {book.title}
              </Heading>
              <Text>{book.author}</Text>
              {book.isPublished ? (
                <Text color='blue.500'>Published</Text>
              ) : (
                <Text color='red.300'>Not Published</Text>
              )}
            </Box>
          </Flex>
        ))}
      </Box>
      <Box>
        <Box
          p={8}
          m={8}
          maxWidth='500px'
          boxShadow='lg'
          borderWidth={1}
          borderRadius={8}
        >
          <form onSubmit={e => handleSubmit(e)}>
            <Heading mb={4}>Add Book</Heading>
            <FormLabel>Title</FormLabel>
            <Input
              mb={2}
              onChange={e => setTitle(e.target.value)}
              value={title}
            />
            <FormLabel>Author</FormLabel>
            <Input
              mb={2}
              onChange={e => setAuthor(e.target.value)}
              value={author}
            />
            <Checkbox
              isChecked={isPublished}
              onChange={e => setIsPublished(e.target.checked)}
            >
              Is Published
            </Checkbox>
            <br />
            <Button p={2} mt={4} type='submit'>
              Submit
            </Button>
          </form>
        </Box>
        <Box
          p={8}
          m={8}
          maxWidth='500px'
          boxShadow='lg'
          borderWidth={1}
          borderRadius={8}
        >
          <form onSubmit={e => e.preventDefault()}>
            <Heading mb={4}>Update Book</Heading>
            <FormLabel>Title</FormLabel>
            <Input
              mb={2}
              onChange={e => setUpdateTitle(e.target.value)}
              value={updateTitle}
            />
            <FormLabel>Author</FormLabel>
            <Input
              mb={2}
              onChange={e => setUpdateAuthor(e.target.value)}
              value={updateAuthor}
            />
            <Checkbox
              onChange={e => setUpdateIsPublished(e.target.checked)}
              isChecked={updateIsPublished}
            >
              Is Published
            </Checkbox>
            <br />
            <Button p={2} mt={4} type='submit'>
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  )
}

export default App
