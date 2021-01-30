import './App.css'
import { useEffect, useState } from 'react'
import { useBooksQuery, useCreateBookMutation } from './generated/graphql'
import {
  Flex,
  Box,
  Text,
  Heading,
  Input,
  FormLabel,
  Button,
} from '@chakra-ui/react'

type Book = {
  id: string
  title: string
  author: string
  isPublished: boolean
}

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [books, setBooks] = useState<Book[]>()
  const { data } = useBooksQuery()
  const [createBook] = useCreateBookMutation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { data: bookData } = await createBook({
      variables: { data: { title, author } },
    })
    if (bookData) {
      setBooks(books?.concat(bookData.createBook))
    }
    resetForm()
  }

  function resetForm() {
    setTitle('')
    setAuthor('')
  }

  useEffect(() => {
    setBooks(data?.books)
  }, [data])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <Flex justify='center'>
      <Box width='50%' p={8}>
        {books?.map(book => (
          <Box key={book.id} paddingBottom='30px'>
            <Heading>{book.title}</Heading>
            <Text>{book.author}</Text>
            {book.isPublished ? (
              <Text color='blue.500'>Published</Text>
            ) : (
              <Text color='red.300'>Not Published</Text>
            )}
          </Box>
        ))}
      </Box>
      <Box>
        <Box
          p={8}
          mt={8}
          maxWidth='500px'
          boxShadow='lg'
          borderWidth={1}
          borderRadius={8}
        >
          <form onSubmit={e => handleSubmit(e)}>
            <Heading mb={4}>Add Book</Heading>
            <FormLabel>Title</FormLabel>
            <Input onChange={e => setTitle(e.target.value)} value={title} />
            <FormLabel>Author</FormLabel>
            <Input onChange={e => setAuthor(e.target.value)} value={author} />
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
