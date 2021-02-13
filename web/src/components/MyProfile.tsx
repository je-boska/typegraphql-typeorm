import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Heading,
  ModalFooter,
  IconButton,
  Button,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { UserType } from '../types'
import moment from 'moment'
import { EditIcon } from '@chakra-ui/icons'
import { MeQuery, useUpdateUserMutation } from '../generated/graphql'
import { ApolloQueryResult } from '@apollo/client'

interface ProfileProps {
  user: UserType | null
  profileOpen: boolean
  onProfileClose: () => void
  refetchMe: () => Promise<ApolloQueryResult<MeQuery>>
}

export const MyProfile: React.FC<ProfileProps> = ({
  user,
  profileOpen,
  onProfileClose,
  refetchMe,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [update] = useUpdateUserMutation()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setAbout(user.about)
      setEmail(user.email)
    }
  }, [user])

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    update({ variables: { data: { name, about, email, password } } })
    onProfileClose()
    refetchMe()
  }

  if (!user) {
    return (
      <Modal isCentered isOpen={profileOpen} onClose={onProfileClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>No user</ModalHeader>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal isCentered isOpen={profileOpen} onClose={onProfileClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {!isEditing && (
          <ModalBody>
            <Heading mt={4} mb={4}>
              {user.name}
            </Heading>
            <Text mb={4} opacity='0.4'>
              joined {moment(user.createdAt).fromNow()}
            </Text>
            <Text>{user.about}</Text>
          </ModalBody>
        )}
        {isEditing && (
          <ModalBody>
            <form onSubmit={e => submitHandler(e)}>
              <FormLabel>Name</FormLabel>
              <Input
                mb={4}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <FormLabel>About</FormLabel>
              <Input
                mb={4}
                value={about}
                onChange={e => setAbout(e.target.value)}
              />
              <FormLabel>Email</FormLabel>
              <Input
                mb={4}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <FormLabel>Password</FormLabel>
              <Input
                mb={4}
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button type='submit'>Submit</Button>
            </form>
          </ModalBody>
        )}
        <ModalFooter>
          {!isEditing && (
            <IconButton
              variant='ghost'
              aria-label='Edit profile'
              icon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
