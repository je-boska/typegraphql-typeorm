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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { PostType } from '../types'

interface PostProps {
  post: PostType
  userId: string
  deletePost: (id: string) => void
  selectPost: (post: PostType) => void
}

export const Post: React.FC<PostProps> = ({
  post,
  userId,
  deletePost,
  selectPost,
}) => {
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
      <Flex maxW='500px' borderWidth={1} borderRadius={4} p={4} mt={4}>
        <Box pr={2}>
          <Heading size='md' mb={2}>
            {post.title}
          </Heading>
          <Text mb={2}>{post.user.name}</Text>
          <Text mb={2}>{post.body}</Text>
        </Box>
        {post.user.id === userId ? (
          <Flex ml='auto' direction='column'>
            <Button onClick={onOpen} bgColor='transparent'>
              <DeleteIcon />
            </Button>
            <Button onClick={() => selectPost(post)} bgColor='transparent'>
              <EditIcon />
            </Button>
          </Flex>
        ) : null}
      </Flex>
    </>
  )
}
