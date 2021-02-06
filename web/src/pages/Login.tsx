import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
  FormLabel,
  Input,
  Link as ChakraLink,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLoginMutation } from '../generated/graphql'

const Login: React.FC<{}> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [login] = useLoginMutation()

  const history = useHistory()

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if (token) {
      history.push('/')
    }
  })

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { data } = await login({ variables: { data: { email, password } } })
    if (!data) return
    if (data.login.errors) {
      setError(data.login.errors[0].message)
      return
    }
    if (data.login.token && data.login.user) {
      localStorage.setItem('user-token', data.login.token)
      setError('')
    }
  }

  return (
    <Container centerContent>
      <Box width={250} mt={20}>
        <form onSubmit={e => submitHandler(e)}>
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
          <span>New here? </span>
          <ChakraLink href='/register' color='blue.500'>
            Register
          </ChakraLink>
          <br />
          <Button type='submit' mt={4}>
            Log in
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default Login
