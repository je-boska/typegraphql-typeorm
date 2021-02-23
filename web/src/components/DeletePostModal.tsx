import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import React from 'react'

interface DeletePostModalProps {
  postId: string
  isOpen: boolean
  onClose: () => void
  deletePost: (id: string) => void
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  postId,
  isOpen,
  onClose,
  deletePost,
}) => {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalBody>Are you sure you want to delete this post?</ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              onClick={() => {
                onClose()
                deletePost(postId)
              }}
              mr={3}
              bgColor='red.400'
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
