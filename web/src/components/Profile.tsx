import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalBody,
  Text,
  Heading,
  Avatar,
  Spinner,
} from '@chakra-ui/react'
import React from 'react'
import { OtherUserType } from '../types'
import moment from 'moment'
import { useUserQuery } from '../generated/graphql'

interface ProfileProps {
  userId: string
  profileOpen: boolean
  onProfileClose: () => void
  follow: (followId: string) => void
  unfollow: (followId: string) => void
  follows: OtherUserType[]
}

export const Profile: React.FC<ProfileProps> = ({
  userId,
  profileOpen,
  onProfileClose,
  follow,
  unfollow,
  follows,
}) => {
  const { data: userData, loading } = useUserQuery({
    variables: { id: userId },
  })

  if (loading) {
    return <Spinner />
  }

  if (!userData) {
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
        <ModalBody>
          <Avatar
            mt={4}
            size='xl'
            src={userData.user.avatar}
            name={userData.user.name}
          />
          <Heading mt={4} mb={4}>
            {userData.user.name}
          </Heading>
          <Text mb={4} opacity='0.4'>
            joined {moment(userData.user.createdAt).fromNow()}
          </Text>
          <Text>{userData.user.about}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              follows.includes(userData.user)
                ? unfollow(userData.user.id)
                : follow(userData.user.id)
              onProfileClose()
            }}
          >
            {follows.includes(userData.user) ? 'Unfollow' : 'Follow'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
