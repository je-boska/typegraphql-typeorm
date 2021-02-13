import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRegisterMutation } from '../generated/graphql'
import { useHistory } from 'react-router-dom'

const Register: React.FC<{}> = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [register] = useRegisterMutation()
  const history = useHistory()
  const [token, setToken] = useState('')

  useEffect(() => {
    const localToken = localStorage.getItem('user-token')
    if (token || localToken) {
      history.push('/')
    }
  }, [token, history])

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { data } = await register({
      variables: { data: { name, email, password, about: '' } },
    })
    if (data?.register.errors) {
      setError(data.register.errors[0].message)
    }
    if (data?.register.token) {
      setError('')
      localStorage.setItem('user-token', data.register.token)
      setToken(data.register.token)
    }
  }

  return (
    <Container centerContent>
      <Box width={250} mt={20}>
        <form onSubmit={e => submitHandler(e)}>
          <FormLabel>Name</FormLabel>
          <Input mb={4} value={name} onChange={e => setName(e.target.value)} />
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
          {error && (
            <Alert mb={4}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type='submit'>Log in</Button>
        </form>
      </Box>
    </Container>
  )
}

export default Register
