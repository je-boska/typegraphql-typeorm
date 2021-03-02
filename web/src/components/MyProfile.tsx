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
  Box,
  Spinner,
  useColorMode,
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { UserType } from '../types'
import moment from 'moment'
import { EditIcon } from '@chakra-ui/icons'
import {
  useDeleteImageMutation,
  useUpdateUserMutation,
  useUploadImageMutation,
} from '../generated/graphql'

interface ProfileProps {
  user: UserType | null
  profileOpen: boolean
  onProfileClose: () => void
}

export const MyProfile: React.FC<ProfileProps> = ({
  user,
  profileOpen,
  onProfileClose,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [about, setAbout] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarId, setAvatarId] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [avatarsToDelete, setAvatarsToDelete] = useState<string[]>([])

  const [update] = useUpdateUserMutation()
  const [upload, { loading }] = useUploadImageMutation()
  const [deleteImage] = useDeleteImageMutation()

  const { colorMode } = useColorMode()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setAbout(user.about)
      setAvatar(user.avatar)
      setAvatarId(user.avatarId)
    }
  }, [user])

  function imageCleanup() {
    avatarsToDelete.forEach(async (avatarId) => {
      await deleteImage({ variables: { imageId: avatarId } })
    })
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    imageCleanup()
    await update({
      variables: { data: { name, about, avatar, avatarId, email, password } },
    })
    setIsEditing(false)
    onProfileClose()
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    if (avatarId) {
      setAvatarsToDelete(avatarsToDelete.concat(avatarId))
    }

    const { data } = await upload({
      variables: { image: e.target.files[0] },
    })

    if (data?.uploadImage.imageUrl && data.uploadImage.imageId) {
      setAvatar(data.uploadImage.imageUrl)
      setAvatarId(data.uploadImage.imageId)
      setError('')
    }
    if (data?.uploadImage.error) {
      setError(data.uploadImage.error)
    }
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
        {!isEditing && (
          <ModalBody>
            <Avatar mt={4} size='xl' src={avatar} name={name} />
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
          <ModalBody mt={4} mb={4}>
            <form onSubmit={(e) => submitHandler(e)}>
              <Avatar mb={4} mr={4} size='xl' src={avatar} name={name} />
              <Box
                mt={2}
                mb={2}
                transition='0.1s border linear'
                display='inline-block'
                padding='8px 0px 8px 0px'
                cursor='pointer'
                border={
                  colorMode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(0, 0, 0, 0.1)'
                }
                borderRadius='7px'
                _hover={{
                  border:
                    colorMode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.3)'
                      : '1px solid rgba(0, 0, 0, 0.2)',
                }}
              >
                <label
                  style={{
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                >
                  {loading ? (
                    <Spinner mt={2} />
                  ) : !avatar ? (
                    'Add Avatar'
                  ) : (
                    'Change Avatar'
                  )}
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/png, image/jpg, image/jpeg'
                    onChange={uploadPhoto}
                  />
                </label>
              </Box>
              {error && (
                <Alert mb={4} mt={4}>
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormLabel>Name</FormLabel>
              <Input
                mb={4}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormLabel>About</FormLabel>
              <Input
                mb={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              <FormLabel>Email</FormLabel>
              <Input
                mb={4}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel>Password</FormLabel>
              <Input
                mb={4}
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant='ghost'
                float='right'
                onClick={() => {
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button variant='ghost' type='submit' float='right'>
                Submit
              </Button>
            </form>
          </ModalBody>
        )}
        {!isEditing && (
          <ModalFooter>
            <IconButton
              variant='ghost'
              aria-label='Edit profile'
              icon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            />
            <Button variant='ghost' onClick={onProfileClose}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}
