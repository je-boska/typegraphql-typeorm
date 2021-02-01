import React from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { BookType } from '../types'

interface BookProps {
  book: BookType
  deleteBook: (id: string) => void
  selectBook: (book: BookType) => void
}

export const Book: React.FC<BookProps> = ({ book, deleteBook, selectBook }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Book</ModalHeader>
          <ModalBody>Are you sure you want to delete this book?</ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              onClick={() => {
                onClose()
                deleteBook(book.id)
              }}
              mr={3}
            >
              Yes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex key={book.id}>
        <Button m='0px 20px' onClick={onOpen} bgColor='transparent'>
          <DeleteIcon />
        </Button>
        <Box pb='30px'>
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
    </>
  )
}
