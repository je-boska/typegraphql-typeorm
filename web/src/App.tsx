import './App.css'
import { useBooksQuery } from './generated/graphql'
import { Flex, Box, Text, Heading } from '@chakra-ui/react'

const App = () => {
  const { data } = useBooksQuery()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <Flex>
      {data.books.map(book => (
        <Box key={book.id}>
          <Heading>{book.title}</Heading>
          <Text>{book.author}</Text>
          {book.isPublished ? (
            <Text>Published</Text>
          ) : (
            <Text>Not Published</Text>
          )}
        </Box>
      ))}
    </Flex>
  )
}

export default App
