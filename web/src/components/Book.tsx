import React from 'react'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { BookType } from '../types'

interface BookProps {
  book: BookType
  deleteBook: (id: string) => void
  selectBook: (book: BookType) => void
}

export const Book: React.FC<BookProps> = ({ book, deleteBook, selectBook }) => {
  return (
    <Flex key={book.id}>
      <Button
        m='0px 20px'
        onClick={() => deleteBook(book.id)}
        backgroundColor='transparent'
      >
        <DeleteIcon />
      </Button>
      <Box width='500px' paddingBottom='30px'>
        <Heading size='lg' onClick={() => selectBook(book)} cursor='pointer'>
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
  )
}
