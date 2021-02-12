import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import React from 'react'
import { OtherUserType } from '../types'

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
        <ModalHeader>{user.name}</ModalHeader>
        <ModalCloseButton />
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
