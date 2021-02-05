import React, { useEffect, useState } from 'react'
import {
  usePostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useUsersQuery,
  useFollowMutation,
  useUserQuery,
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
  const [follow] = useFollowMutation()
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
    localStorage.removeItem('user')
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

  function followHandler(followUser: OtherUserType) {
    if (!user) return
    let followsArray = user.follows
    if (followsArray.some(u => u['name'] === followUser.name)) return
    followsArray.push(followUser)
    const newUser = { ...user, follows: followsArray }
    setUser(newUser)
    follow({ variables: { userId: user.id, followId: followUser.id } })
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
        <Box w={250} borderWidth={1} p={8} mr={4} mt={4} borderRadius={4}>
          <Text mb={2}>Following</Text>
          {user?.follows.map(u => (
            <Text key={u.id}>{u.name}</Text>
          ))}
          <Text mb={2} mt={8}>
            Other users
          </Text>
          {users
            .filter(u => u.id !== user.id)
            .map(u => (
              <Flex key={u.id}>
                <Text>{u.name}</Text>
                <Text
                  ml='auto'
                  cursor='pointer'
                  onClick={() => followHandler(u)}
                >
                  +
                </Text>
              </Flex>
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
            <Box>
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
