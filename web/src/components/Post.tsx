import React from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  Image,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { PostType } from '../types'
import moment from 'moment'
import { useDeleteImageMutation } from '../generated/graphql'
import { DeletePostModal } from './DeletePostModal'

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
  const [deleteImage] = useDeleteImageMutation()

  function deletePostHandler(id: string) {
    if (post.imageId) {
      deleteImage({ variables: { imageId: post.imageId } })
    }
    deletePost(id)
  }

  return (
    <>
      <DeletePostModal
        isOpen={isOpen}
        onClose={onClose}
        postId={post.id}
        deletePost={deletePostHandler}
      />
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
