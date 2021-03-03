import React, { useEffect, useState } from 'react'
import {
  useDeletePostMutation,
  useFollowMutation,
  useMeQuery,
  usePostsQuery,
  useUnfollowMutation,
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
  Spinner,
} from '@chakra-ui/react'
import { PostForm } from '../components/PostForm'
import { Post } from '../components/Post'
import { PostType } from '../types'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom'
import { UsersList } from '../components/UsersList'
import { useApolloClient } from '@apollo/client'
import { MyProfile } from '../components/MyProfile'
import { Profile } from '../components/Profile'

const Home: React.FC = () => {
  const [offset, setOffset] = useState(0)
  const [postId, setPostId] = useState('')
  const [token, setToken] = useState('')
  const [selectedUser, setSelectedUser] = useState('')

  const { colorMode, toggleColorMode } = useColorMode()
  const {
    isOpen: profileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure()

  const {
    isOpen: myProfileOpen,
    onOpen: onMyProfileOpen,
    onClose: onMyProfileClose,
  } = useDisclosure()

  const { data: userData, refetch: refetchMe } = useMeQuery()
  const { data: postData, refetch: refetchPosts } = usePostsQuery({
    variables: { offset: offset },
  })

  const [deletePost] = useDeletePostMutation()
  const [follow] = useFollowMutation()
  const [unfollow] = useUnfollowMutation()

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

  async function deletePostHandler(id: string) {
    await deletePost({
      variables: { id },
    })
    refetchPosts()
  }

  function selectPostHandler(post: PostType) {
    const { id } = post
    setPostId(id)
  }

  async function followHandler(followId: string) {
    if (!userData) return
    await follow({
      variables: { userId: userData.me.id, followId },
    })
    refetchMe()
    refetchPosts()
  }

  async function unfollowHandler(followId: string) {
    if (!userData) return
    await unfollow({
      variables: { userId: userData.me.id, followId },
    })
    refetchMe()
    refetchPosts()
  }

  if (!userData) {
    return (
      <Container m={16} centerContent>
        <Spinner />
      </Container>
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
        <Heading p={2} size='xl' opacity='0.1' mr='auto'>
          Midnight Request Line
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
      <Flex maxW='100%' wrap='wrap' justify='center'>
        {selectedUser && (
          <Profile
            userId={selectedUser}
            profileOpen={profileOpen}
            onProfileClose={onProfileClose}
            follow={followHandler}
            unfollow={unfollowHandler}
            follows={userData.me.follows}
          />
        )}
        <UsersList
          user={userData.me}
          setSelectedUser={setSelectedUser}
          onProfileOpen={onProfileOpen}
          followHandler={followHandler}
          unfollowHandler={unfollowHandler}
        />
        <Box>
          <Flex justify='center' direction='column'>
            <Box>
              {!postId && (
                <PostForm
                  postId={''}
                  setPostId={setPostId}
                  heading='Create Post'
                  userId={userData.me.id}
                  refetchPosts={refetchPosts}
                />
              )}
              {postId && (
                <PostForm
                  postId={postId}
                  setPostId={setPostId}
                  heading='Edit Post'
                  userId={userData.me.id}
                  refetchPosts={refetchPosts}
                />
              )}
            </Box>
            <Box>
              {postData?.posts.map((p) => (
                <Post
                  key={p.id}
                  userId={userData.me.id}
                  post={p}
                  deletePost={deletePostHandler}
                  selectPost={selectPostHandler}
                  setSelectedUser={setSelectedUser}
                  onProfileOpen={onProfileOpen}
                  onMyProfileOpen={onMyProfileOpen}
                  followHandler={followHandler}
                  unfollowHandler={unfollowHandler}
                />
              ))}
            </Box>
            <Flex mt={4} mb={8} justify='flex-end'>
              {offset !== 0 && (
                <IconButton
                  aria-label='previous page'
                  icon={<ArrowLeftIcon />}
                  mr={2}
                  onClick={() => offset >= 5 && setOffset(offset - 5)}
                >
                  Prev
                </IconButton>
              )}
              {postData && postData.posts.length === 5 && (
                <IconButton
                  aria-label='next page'
                  icon={<ArrowRightIcon />}
                  onClick={() => setOffset(offset + 5)}
                />
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Home
