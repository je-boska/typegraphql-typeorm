import React, { useEffect, useState } from 'react'
import {
  useDeletePostMutation,
  useUpdatePostMutation,
  useMeQuery,
  useCreatePostMutation,
  usePostsQuery,
  PostsDocument,
} from '../generated/graphql'
import {
  Flex,
  Box,
  Text,
  Heading,
  Container,
  useColorMode,
  IconButton,
  Button,
} from '@chakra-ui/react'
import { PostForm } from '../components/PostForm'
import { Post } from '../components/Post'
import { PostType } from '../types'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom'
import { UsersList } from '../components/UsersList'
import { useApolloClient } from '@apollo/client'

const Home: React.FC = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateBody, setUpdateBody] = useState('')
  const [token, setToken] = useState('')
  const { colorMode, toggleColorMode } = useColorMode()

  const { data: userData } = useMeQuery()
  const { data: postData } = usePostsQuery()
  const [createPost] = useCreatePostMutation()
  const [updatePost] = useUpdatePostMutation()
  const [deletePost] = useDeletePostMutation()

  const history = useHistory()
  const client = useApolloClient()

  useEffect(() => {
    const localToken = localStorage.getItem('user-token')
    if (localToken) setToken(localToken)
    if (!token && !localToken) history.push('/login')
  }, [token, history])

  function logoutHandler() {
    client.cache.reset()
    localStorage.removeItem('user-token')
    setToken('')
  }

  async function handleSubmit() {
    if (!userData) return
    await createPost({
      variables: { data: { title, body }, userId: userData.me.id },
      refetchQueries: [{ query: PostsDocument }],
    })
    resetAddForm()
  }

  async function handleUpdateSubmit() {
    await updatePost({
      variables: {
        id: updateId,
        data: {
          title: updateTitle,
          body: updateBody,
        },
      },
    })
    resetUpdateForm()
  }

  function resetAddForm() {
    setTitle('')
    setBody('')
  }

  function resetUpdateForm() {
    setUpdateId('')
    setUpdateTitle('')
    setUpdateBody('')
  }

  function deletePostHandler(id: string) {
    deletePost({
      variables: { id },
      refetchQueries: [{ query: PostsDocument }],
    })
    resetUpdateForm()
  }

  function selectPostHandler(post: PostType) {
    const { id, title, body } = post
    setUpdateId(id)
    setUpdateTitle(title)
    setUpdateBody(body)
  }

  if (!userData) {
    return (
      <Box m={8}>
        <Text>Loading...</Text>
      </Box>
    )
  }

  return (
    <Container maxWidth='100%' centerContent>
      <Flex
        width='100%'
        align='center'
        p={2}
        justify='flex-end'
        wrap='wrap'
        borderBottomWidth={1}
      >
        <Heading p={2} size='2xl' opacity='0.1' mr='auto'>
          /||
        </Heading>
        <IconButton
          mr={4}
          aria-label='Change color mode'
          onClick={toggleColorMode}
          bgColor='transparent'
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
        <Button onClick={logoutHandler}>Log out</Button>
      </Flex>
      <Flex maxW='100%' wrap='wrap'>
        <UsersList user={userData.me} />
        <Box>
          <Flex justify='center' direction='column'>
            <Box>
              {!updateId && (
                <PostForm
                  heading='Add Post'
                  onSubmit={handleSubmit}
                  title={title}
                  setTitle={setTitle}
                  body={body}
                  setBody={setBody}
                />
              )}
              {updateId && (
                <PostForm
                  heading='Update Post'
                  onSubmit={handleUpdateSubmit}
                  cancel={resetUpdateForm}
                  title={updateTitle}
                  setTitle={setUpdateTitle}
                  body={updateBody}
                  setBody={setUpdateBody}
                />
              )}
            </Box>
            <Box>
              {postData?.posts.map(p => (
                <Post
                  key={p.id}
                  userId={userData.me.id}
                  post={p}
                  deletePost={deletePostHandler}
                  selectPost={selectPostHandler}
                />
              ))}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Home
