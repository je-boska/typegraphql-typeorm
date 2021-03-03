import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useUsersQuery } from '../generated/graphql'
import { UserType } from '../types'

interface UsersListProps {
  user: UserType
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>
  onProfileOpen: () => void
  followHandler: (followId: string) => Promise<void>
  unfollowHandler: (followId: string) => Promise<void>
}

export const UsersList: React.FC<UsersListProps> = ({
  user,
  setSelectedUser,
  onProfileOpen,
  followHandler,
  unfollowHandler,
}) => {
  const { data: users } = useUsersQuery()

  const [searchTerm, setSearchTerm] = useState('')

  const [isLargerThan850] = useMediaQuery('(min-width: 850px)')

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
                  setSelectedUser(u.id)
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
                    setSelectedUser(u.id)
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
