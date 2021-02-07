import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import {
  MeDocument,
  useFollowMutation,
  useUnfollowMutation,
  useUsersQuery,
} from '../generated/graphql'
import { OtherUserType } from '../types'

interface UsersListProps {
  follows: OtherUserType[]
  userId: string
}

export const UsersList: React.FC<UsersListProps> = ({ follows, userId }) => {
  const { data: users } = useUsersQuery()
  const [follow] = useFollowMutation()
  const [unfollow] = useUnfollowMutation()

  async function followHandler(followId: string) {
    await follow({
      variables: { userId, followId },
      refetchQueries: [{ query: MeDocument }],
    })
  }

  async function unfollowHandler(followId: string) {
    await unfollow({
      variables: { userId, followId },
      refetchQueries: [{ query: MeDocument }],
    })
  }

  return (
    <Box w={250} borderWidth={1} p={8} mr={4} mt={4} borderRadius={4}>
      <Text mb={2}>Following</Text>
      {follows &&
        follows.map(u => (
          <Flex>
            <Text key={u.id}>{u.name}</Text>
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
        .filter(u => u.id !== userId)
        .map(u => (
          <Flex key={u.id}>
            <Text>{u.name}</Text>
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
