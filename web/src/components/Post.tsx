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
  Image,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { PostType } from '../types'
import moment from 'moment'

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
      <Flex
        maxW='500px'
        borderWidth={1}
        borderRadius={4}
        p={4}
        mt={4}
        direction='column'
      >
        <Flex>
          <Box pr={2}>
            <Box mb={2}>
              <Text as='span' color='blue.500'>
                {post.name}{' '}
              </Text>
              <Text as='span' mb={2} opacity='0.4'>
                {moment(post.createdAt).fromNow()}
              </Text>
            </Box>
            {post.title && (
              <Heading size='md' mb={2}>
                {post.title}
              </Heading>
            )}
          </Box>
          {post.userId === userId && (
            <Flex ml='auto' direction='row'>
              <Button w={2} onClick={onOpen} bgColor='transparent'>
                <DeleteIcon />
              </Button>
              <Button
                w={2}
                onClick={() => selectPost(post)}
                bgColor='transparent'
              >
                <EditIcon />
              </Button>
            </Flex>
          )}
        </Flex>
        {post.image && (
          <Image mt={2} mb={4} src={post.image} alt={post.title} />
        )}
        {post.body && <Text mb={2}>{post.body}</Text>}
      </Flex>
    </>
  )
}
