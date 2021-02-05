import {
  Box,
  Heading,
  FormLabel,
  Input,
  Button,
  Textarea,
} from '@chakra-ui/react'
import React from 'react'

interface PostFormProps {
  heading: string
  onSubmit: () => Promise<void>
  cancel?: () => void
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  body: string
  setBody: React.Dispatch<React.SetStateAction<string>>
}

export const PostForm: React.FC<PostFormProps> = ({
  heading,
  onSubmit,
  cancel,
  title,
  setTitle,
  body,
  setBody,
}) => {
  return (
    <Box p={4} mt={4} maxW='500px' borderRadius={4} borderWidth={1}>
      <form
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Heading size='md' mb={4}>
          {heading}
        </Heading>
        <FormLabel>Title</FormLabel>
        <Input mb={2} onChange={e => setTitle(e.target.value)} value={title} />
        <FormLabel>Body</FormLabel>
        <Textarea mb={2} onChange={e => setBody(e.target.value)} value={body} />
        <Button p={2} mt={2} mr={2} type='submit'>
          Submit
        </Button>
        {heading === 'Update Post' && (
          <Button p={2} mt={2} type='button' onClick={cancel}>
            Cancel
          </Button>
        )}
      </form>
    </Box>
  )
}
