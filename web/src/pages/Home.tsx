import React, { useEffect, useState } from 'react'
import {
  useDeletePostMutation,
  useUpdatePostMutation,
  useMeQuery,
  useCreatePostMutation,
  usePostsQuery,
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
  useDisclosure,
} from '@chakra-ui/react'
import { PostForm } from '../components/PostForm'
import { Post } from '../components/Post'
import { PostType } from '../types'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom'
import { UsersList } from '../components/UsersList'
import { useApolloClient } from '@apollo/client'
import { MyProfile } from '../components/MyProfile'

const Home: React.FC = () => {
  const [offset, setOffset] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateBody, setUpdateBody] = useState('')
  const [token, setToken] = useState('')
  const { colorMode, toggleColorMode } = useColorMode()

  const { data: userData } = useMeQuery()
  const { data: postData, refetch: refetchPosts } = usePostsQuery({
    variables: { offset: offset },
  })
  const [createPost] = useCreatePostMutation()
  const [updatePost] = useUpdatePostMutation()
  const [deletePost] = useDeletePostMutation()

  const history = useHistory()
  const client = useApolloClient()

  const {
    isOpen: myProfileOpen,
    onOpen: onMyProfileOpen,
    onClose: onMyProfileClose,
  } = useDisclosure()

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
    })
    refetchPosts()
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
    refetchPosts()
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

  async function deletePostHandler(id: string) {
    await deletePost({
      variables: { id },
    })
    refetchPosts()
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
        <Text mr={2}>{userData.me.name}</Text>
        <IconButton
          aria-label='View/edit profile'
          bgColor='transparent'
          onClick={onMyProfileOpen}
          icon={<i className='fas fa-user'></i>}
        />
        <MyProfile
          user={userData.me}
          profileOpen={myProfileOpen}
          onProfileClose={onMyProfileClose}
        />
        <IconButton
          mr={2}
          aria-label='Change color mode'
          onClick={toggleColorMode}
          bgColor='transparent'
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
        <Button onClick={logoutHandler}>Log out</Button>
      </Flex>
      <Flex maxW='100%' wrap='wrap'>
        <UsersList user={userData.me} refetchPosts={refetchPosts} />
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
            <Flex mt={4} justify='flex-end'>
              {offset !== 0 && (
                <Button
                  mr={2}
                  onClick={() => offset >= 5 && setOffset(offset - 5)}
                >
                  Prev
                </Button>
              )}
              {postData && postData.posts.length === 5 && (
                <Button onClick={() => setOffset(offset + 5)}>Next</Button>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Home
