import { ApolloQueryResult } from '@apollo/client'
import {
  Box,
  Heading,
  FormLabel,
  Input,
  Button,
  Textarea,
  Image,
  Alert,
  AlertDescription,
  AlertIcon,
  useColorMode,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
  PostsQuery,
  useCreatePostMutation,
  usePostQuery,
  useUpdatePostMutation,
  useUploadImageMutation,
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
  const [image, setImage] = useState('')
  const [imageId, setImageId] = useState('')
  const [error, setError] = useState('')

  const { colorMode } = useColorMode()

  const [createPost] = useCreatePostMutation()
  const [updatePost] = useUpdatePostMutation()
  const [upload, { loading }] = useUploadImageMutation()

  const { data } = usePostQuery({ variables: { id: postId } })

  useEffect(() => {
    if (data) {
      setTitle(data.post.title)
      setBody(data.post.body)
      setImage(data.post.image)
    }
  }, [data])

  async function handleSubmit() {
    await createPost({
      variables: { data: { title, body, image, imageId }, userId },
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
          image,
          imageId,
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
    setImage('')
    setImageId('')
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const { data } = await upload({
      variables: { image: e.target.files[0] },
    })

    if (data?.uploadImage.imageUrl && data.uploadImage.imageId) {
      setImage(data.uploadImage.imageUrl)
      setImageId(data.uploadImage.imageId)
      setError('')
    }
    if (data?.uploadImage.error) {
      setError(data.uploadImage.error)
    }
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
        <Box
          mt={2}
          mb={2}
          transition='0.1s border linear'
          display='inline-block'
          padding='8px 0px 8px 0px'
          cursor='pointer'
          border={
            colorMode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(0, 0, 0, 0.1)'
          }
          borderRadius='7px'
          _hover={{
            border:
              colorMode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.3)'
                : '1px solid rgba(0, 0, 0, 0.2)',
          }}
        >
          <label
            style={{
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            {loading ? 'Loading' : !image ? 'Add Image' : 'Replace Image'}
            <input
              type='file'
              style={{ display: 'none' }}
              accept='image/png, image/jpg, image/jpeg'
              onChange={uploadPhoto}
            />
          </label>
        </Box>
        <br />
        {error && (
          <Alert mb={4} mt={4}>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button p={2} mt={4} mr={2} type='submit'>
          Submit
        </Button>
        {heading === 'Update Post' && (
          <Button p={2} mt={4} type='button' onClick={() => resetForm()}>
            Cancel
          </Button>
        )}
        {image && <Image src={image} mt={4} />}
      </form>
    </Box>
  )
}
