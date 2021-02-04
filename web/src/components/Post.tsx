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
import { PostType } from '../types'

interface PostProps {
  post: PostType
  deletePost: (id: string) => void
  selectPost: (post: PostType) => void
}

export const Post: React.FC<PostProps> = ({ post, deletePost, selectPost }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalBody>Are you sure you want to delete this post?</ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              onClick={() => {
                onClose()
                deletePost(post.id)
              }}
              mr={3}
              bgColor='red.400'
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex maxW='500px' borderWidth={1} borderRadius={4} p={4} mb={8}>
        <Box>
          <Heading
            size='md'
            mb={2}
            onClick={() => selectPost(post)}
            cursor='pointer'
          >
            {post.title}
          </Heading>
          <Text>{post.body}</Text>
          <Text>by {post.user.name}</Text>
        </Box>
        <Button onClick={onOpen} bgColor='transparent'>
          <DeleteIcon />
        </Button>
      </Flex>
    </>
  )
}
