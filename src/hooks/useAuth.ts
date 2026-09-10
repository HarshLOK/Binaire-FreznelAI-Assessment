import { useEffect, useMemo, useState } from 'react'
import { type User } from 'firebase/auth'
import { AuthService } from '../auth/AuthService'

export const useAuth = () => {
  const service = useMemo(() => new AuthService(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = service.subscribe((nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    return unsubscribe
  }, [service])

  const signup = (email: string, password: string) => {
    setError(null)
    return service.signup(email, password).catch((signupError: Error) => {
      setError(signupError.message)
      throw signupError
    })
  }

  const login = (email: string, password: string) => {
    setError(null)
    return service.login(email, password).catch((loginError: Error) => {
      setError(loginError.message)
      throw loginError
    })
  }

  const logout = () => {
    setError(null)
    return service.logout().catch((logoutError: Error) => {
      setError(logoutError.message)
      throw logoutError
    })
  }

  return {
    user,
    loading,
    error,
    firebaseEnabled: service.isEnabled(),
    signup,
    login,
    logout,
  }
}
