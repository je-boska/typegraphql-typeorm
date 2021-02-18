import { ApolloQueryResult } from '@apollo/client'
import {
  Box,
  Heading,
  FormLabel,
  Input,
  Button,
  Textarea,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
  PostsQuery,
  useCreatePostMutation,
  usePostQuery,
  useUpdatePostMutation,
} from '../generated/graphql'

interface PostFormProps {
  heading: string
  userId: string
  postId: string
  setPostId: React.Dispatch<React.SetStateAction<string>>
  refetchPosts: () => Promise<ApolloQueryResult<PostsQuery>>
}

export const PostForm: React.FC<PostFormProps> = ({
  heading,
  userId,
  postId,
  setPostId,
  refetchPosts,
}) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const [createPost] = useCreatePostMutation()
  const [updatePost] = useUpdatePostMutation()

  const { data } = usePostQuery({ variables: { id: postId } })

  useEffect(() => {
    if (data) {
      setTitle(data.post.title)
      setBody(data.post.body)
    }
  }, [data])

  async function handleSubmit() {
    await createPost({
      variables: { data: { title, body }, userId },
    })
    refetchPosts()
    resetForm()
  }

  async function handleUpdateSubmit() {
    if (!postId) return
    await updatePost({
      variables: {
        id: postId,
        data: {
          title,
          body,
        },
      },
    })
    refetchPosts()
    resetForm()
  }

  function resetForm() {
    setPostId('')
    setTitle('')
    setBody('')
  }

  return (
    <Box p={4} mt={4} maxW='500px' borderRadius={4} borderWidth={1}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (postId) {
            handleUpdateSubmit()
          } else {
            handleSubmit()
          }
        }}
      >
        <Heading size='md' mb={4}>
          {heading}
        </Heading>
        <FormLabel>Title</FormLabel>
        <Input
          mb={2}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <FormLabel>Body</FormLabel>
        <Textarea
          mb={2}
          onChange={(e) => setBody(e.target.value)}
          value={body}
        />
        <Button p={2} mt={2} mr={2} type='submit'>
          Submit
        </Button>
        {heading === 'Update Post' && (
          <Button p={2} mt={2} type='button' onClick={() => resetForm()}>
            Cancel
          </Button>
        )}
      </form>
    </Box>
  )
}
