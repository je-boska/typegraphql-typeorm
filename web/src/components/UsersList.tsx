import { ApolloQueryResult } from '@apollo/client'
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  MeDocument,
  PostsQuery,
  useFollowMutation,
  useUnfollowMutation,
  useUsersQuery,
} from '../generated/graphql'
import { OtherUserType, UserType } from '../types'
import { Profile } from './Profile'

interface UsersListProps {
  user: UserType
  refetchPosts: () => Promise<ApolloQueryResult<PostsQuery>>
}

export const UsersList: React.FC<UsersListProps> = ({ user, refetchPosts }) => {
  const { data: users } = useUsersQuery()
  const [follow] = useFollowMutation()
  const [unfollow] = useUnfollowMutation()

  const [selectedUser, setSelectedUser] = useState<OtherUserType | null>(null)

  const {
    isOpen: profileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure()

  async function followHandler(followId: string) {
    await follow({
      variables: { userId: user.id, followId },
      refetchQueries: [{ query: MeDocument }],
    })
    refetchPosts()
  }

  async function unfollowHandler(followId: string) {
    await unfollow({
      variables: { userId: user.id, followId },
      refetchQueries: [{ query: MeDocument }],
    })
    refetchPosts()
  }

  return (
    <Box
      w={250}
      alignSelf='flex-start'
      borderWidth={1}
      p={8}
      mr={4}
      mt={4}
      borderRadius={4}
    >
      {' '}
      <Profile
        user={selectedUser}
        profileOpen={profileOpen}
        onProfileClose={onProfileClose}
        follow={followHandler}
        unfollow={unfollowHandler}
        follows={user.follows}
      />
      <Text mb={2}>Following</Text>
      {user.follows &&
        user.follows.map(u => (
          <Flex key={u.id}>
            <Text
              color='blue.500'
              cursor='pointer'
              onClick={() => {
                setSelectedUser(u)
                onProfileOpen()
              }}
            >
              {u.name}
            </Text>
            <Text
              ml='auto'
              cursor='pointer'
              onClick={() => unfollowHandler(u.id)}
            >
              -
            </Text>
          </Flex>
        ))}
      <Text mb={2} mt={8}>
        Other users
      </Text>
      {users?.users
        .filter(u => u.id !== user.id)
        .filter(u => (user.follows.some(f => f['id'] === u.id) ? null : u))
        .map(u => (
          <Flex key={u.id}>
            <Text
              color='blue.500'
              cursor='pointer'
              onClick={() => {
                setSelectedUser(u)
                onProfileOpen()
              }}
            >
              {u.name}
            </Text>
            <Text
              ml='auto'
              cursor='pointer'
              onClick={() => followHandler(u.id)}
            >
              +
            </Text>
          </Flex>
        ))}
    </Box>
  )
}
