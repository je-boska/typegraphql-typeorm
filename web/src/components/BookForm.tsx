import {
  Box,
  Heading,
  FormLabel,
  Input,
  Checkbox,
  Button,
} from '@chakra-ui/react'
import React from 'react'

interface BookFormProps {
  heading: string
  onSubmit: () => Promise<void>
  cancel?: () => void
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  author: string
  setAuthor: React.Dispatch<React.SetStateAction<string>>
  isPublished: boolean
  setIsPublished: React.Dispatch<React.SetStateAction<boolean>>
}

export const BookForm: React.FC<BookFormProps> = ({
  heading,
  onSubmit,
  cancel,
  title,
  setTitle,
  author,
  setAuthor,
  isPublished,
  setIsPublished,
}) => {
  return (
    <Box
      p={8}
      m={8}
      maxWidth='500px'
      boxShadow='lg'
      borderWidth={1}
      borderRadius={8}
    >
      <form
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Heading size='lg' mb={4}>
          {heading}
        </Heading>
        <FormLabel>Title</FormLabel>
        <Input mb={2} onChange={e => setTitle(e.target.value)} value={title} />
        <FormLabel>Author</FormLabel>
        <Input
          mb={2}
          onChange={e => setAuthor(e.target.value)}
          value={author}
        />
        <Checkbox
          onChange={e => setIsPublished(e.target.checked)}
          isChecked={isPublished}
        >
          Is Published
        </Checkbox>
        <br />
        <Button p={2} mt={4} mr={2} type='submit'>
          Submit
        </Button>
        {heading === 'Update Book' && (
          <Button p={2} mt={4} type='button' onClick={cancel}>
            Cancel
          </Button>
        )}
      </form>
    </Box>
  )
}
