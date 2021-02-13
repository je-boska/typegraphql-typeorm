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
} from '@chakra-ui/react'
import React from 'react'
import { OtherUserType } from '../types'
import moment from 'moment'

interface ProfileProps {
  user: OtherUserType | null
  profileOpen: boolean
  onProfileClose: () => void
  follow: (followId: string) => void
  unfollow: (followId: string) => void
  follows: OtherUserType[]
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  profileOpen,
  onProfileClose,
  follow,
  unfollow,
  follows,
}) => {
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
        <ModalBody>
          <Heading mt={4} mb={4}>
            {user.name}
          </Heading>
          <Text mb={4} opacity='0.4'>
            joined {moment(user.createdAt).fromNow()}
          </Text>
          <Text>{user.about}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              follows.includes(user) ? unfollow(user.id) : follow(user.id)
              onProfileClose()
            }}
          >
            {follows.includes(user) ? 'Unfollow' : 'Follow'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
