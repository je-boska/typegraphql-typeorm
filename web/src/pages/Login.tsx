import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormLabel,
  Input,
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
      setToken(data.login.token)
    }
  }

  return (
    <Container>
      <Flex justify='center' m={20}>
        <Box width={250}>
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
            <Button type='submit'>Log in</Button>
          </form>
        </Box>
      </Flex>
    </Container>
  )
}

export default Login
