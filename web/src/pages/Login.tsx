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
import { useLoginMutation } from '../generated/graphql'
import { useHistory } from 'react-router-dom'

const Login: React.FC<{}> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [login] = useLoginMutation()
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
    const { data } = await login({ variables: { data: { email, password } } })
    if (data?.login.errors) {
      setError(data.login.errors[0].message)
    }
    if (data?.login.token) {
      setError('')
      localStorage.setItem('user-token', data.login.token)
      localStorage.setItem('user', JSON.stringify(data.login.user))
      setToken(data.login.token)
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
