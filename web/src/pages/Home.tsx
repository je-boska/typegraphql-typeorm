import React, { useEffect, useState } from 'react'
import {
  usePostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useUsersQuery,
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

type UserType = {
  id: string
  name: string
  email: string
  follows: [OtherUserType]
}

type OtherUserType = {
  id: string
  name: string
}

const Home = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateBody, setUpdateBody] = useState('')
  const [posts, setPosts] = useState<PostType[]>([])
  const { data: postsData } = usePostsQuery()
  const [users, setUsers] = useState<OtherUserType[]>([])
  const { data: usersData } = useUsersQuery()
  const [createPost] = useCreatePostMutation()
  const [updatePost] = useUpdatePostMutation()
  const [deletePost] = useDeletePostMutation()
  const { colorMode, toggleColorMode } = useColorMode()
  const history = useHistory()
  const [token, setToken] = useState('')
  const [user, setUser] = useState<UserType>()

  useEffect(() => {
    postsData && setPosts(postsData.posts)
  }, [postsData])

  useEffect(() => {
    usersData && setUsers(usersData.users)
  }, [usersData])

  useEffect(() => {
    const localToken = localStorage.getItem('user-token')
    const user = JSON.parse(localStorage.getItem('user') as string) as UserType
    if (!localToken) {
      history.push('/login')
    } else {
      setToken(localToken)
      setUser(user)
    }
  }, [token, setToken, history])

  function logoutHandler() {
    localStorage.removeItem('user-token')
    setToken('')
  }

  async function handleSubmit() {
    if (!user) {
      return
    }
    const { data: postData } = await createPost({
      variables: { data: { title, body }, userId: user.id },
    })
    if (postData) {
      const newPosts = posts.concat(postData.createPost)
      setPosts(newPosts)
    }
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

    updatePostInState()
    resetUpdateForm()
  }

  function updatePostInState() {
    const postIndex = posts.findIndex(post => post.id === updateId)
    const newPosts = [...posts]
    newPosts[postIndex] = {
      ...newPosts[postIndex],
      title: updateTitle,
      body: updateBody,
    }
    setPosts(newPosts)
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
    deletePost({ variables: { id } })
    setPosts(posts.filter(post => post.id !== id))
    resetUpdateForm()
  }

  function selectPostHandler(post: PostType) {
    const { id, title, body } = post
    setUpdateId(id)
    setUpdateTitle(title)
    setUpdateBody(body)
  }

  if (!postsData || !user) {
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
      <Flex>
        <Box w={250} borderWidth={1} m={8} p={8} borderRadius={4}>
          {user?.follows.map(user => (
            <Text key={user.id} fontSize='1.2rem'>
              {user.name}
            </Text>
          ))}
        </Box>
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
            <Box m={8}>
              {posts.map(post => (
                <Post
                  key={post.id}
                  userId={user.id}
                  post={post}
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
