import {
  ActionButton,
  Button,
  ButtonGroup,
  Flex,
  Text,
  TextField,
  View,
} from '@adobe/react-spectrum'
import { useState } from 'react'
import type { User } from 'firebase/auth'

interface AuthPanelProps {
  user: User | null
  loading: boolean
  firebaseEnabled: boolean
  error: string | null
  onLogin: (email: string, password: string) => Promise<unknown>
  onSignup: (email: string, password: string) => Promise<unknown>
  onLogout: () => Promise<unknown>
}

export const AuthPanel = ({
  user,
  loading,
  firebaseEnabled,
  error,
  onLogin,
  onSignup,
  onLogout,
}: AuthPanelProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (loading) {
    return <Text>Checking authentication status...</Text>
  }

  if (!firebaseEnabled) {
    return (
      <View UNSAFE_className="auth-card">
        <Text>
          Firebase authentication is disabled. Add VITE_FIREBASE_* values in an env file to enable signup/login.
        </Text>
      </View>
    )
  }

  if (user) {
    return (
      <View UNSAFE_className="auth-card">
        <Flex direction="row" alignItems="center" justifyContent="space-between" gap="size-100">
          <Text>Signed in as {user.email}</Text>
          <ActionButton onPress={() => void onLogout()}>Log out</ActionButton>
        </Flex>
      </View>
    )
  }

  return (
    <View UNSAFE_className="auth-card">
      <Flex direction="column" gap="size-150">
        <TextField label="Email" value={email} onChange={setEmail} type="email" />
        <TextField label="Password" value={password} onChange={setPassword} type="password" />
        <ButtonGroup>
          <Button variant="accent" onPress={() => void onLogin(email, password)}>
            Log in
          </Button>
          <Button variant="secondary" onPress={() => void onSignup(email, password)}>
            Sign up
          </Button>
        </ButtonGroup>
        {error ? <Text UNSAFE_className="error-text">{error}</Text> : null}
      </Flex>
    </View>
  )
}
