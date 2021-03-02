import { ApolloQueryResult } from '@apollo/client'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  MeQuery,
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
  refetchMe: () => Promise<ApolloQueryResult<MeQuery>>
}

export const UsersList: React.FC<UsersListProps> = ({
  user,
  refetchPosts,
  refetchMe,
}) => {
  const { data: users } = useUsersQuery()
  const [follow] = useFollowMutation()
  const [unfollow] = useUnfollowMutation()

  const [selectedUser, setSelectedUser] = useState<OtherUserType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [isLargerThan850] = useMediaQuery('(min-width: 850px)')

  const {
    isOpen: profileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure()

  async function followHandler(followId: string) {
    await follow({
      variables: { userId: user.id, followId },
    })
    refetchMe()
    refetchPosts()
  }

  async function unfollowHandler(followId: string) {
    await unfollow({
      variables: { userId: user.id, followId },
    })
    refetchMe()
    refetchPosts()
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setSearchTerm(e.target.value)
  }

  return (
    <Box
      w={isLargerThan850 ? 250 : 500}
      alignSelf='flex-start'
      ml={4}
      mr={4}
      mt={4}
    >
      <Profile
        user={selectedUser}
        profileOpen={profileOpen}
        onProfileClose={onProfileClose}
        follow={followHandler}
        unfollow={unfollowHandler}
        follows={user.follows}
      />
      <InputGroup size='md'>
        <Input
          mb={4}
          pr={2}
          placeholder='Search for users...'
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <InputRightElement>
            <Button size='xs' onClick={() => setSearchTerm('')}>
              X
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {searchTerm.length > 0 &&
        users?.users
          .filter((u) => u.id !== user.id)
          .filter((u) =>
            user.follows.some((f) => f['id'] === u.id) ? null : u
          )
          .filter((u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ? u : null
          )
          .map((u) => (
            <Flex key={u.id}>
              <Text
                color='blue.500'
                cursor='pointer'
                onClick={() => {
                  setSelectedUser(u)
                  onProfileOpen()
                }}
              >
                <Avatar size='xs' mr={2} mb={2} src={u.avatar} name={u.name} />
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
      {searchTerm.length === 0 && (
        <Box borderRadius={4} borderWidth={1} p={4}>
          <Text fontWeight='700' mb={2}>
            Following
          </Text>
          {user.follows &&
            user.follows.map((u) => (
              <Flex key={u.id}>
                <Text
                  color='blue.500'
                  cursor='pointer'
                  onClick={() => {
                    setSelectedUser(u)
                    onProfileOpen()
                  }}
                >
                  <Avatar
                    size='xs'
                    mr={2}
                    mb={2}
                    src={u.avatar}
                    name={u.name}
                  />
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
        </Box>
      )}
    </Box>
  )
}
