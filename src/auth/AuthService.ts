import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { authInstance, firebaseEnabled } from './firebase'

export class AuthService {
  isEnabled(): boolean {
    return firebaseEnabled && authInstance !== null
  }

  signup(email: string, password: string) {
    if (!authInstance) {
      return Promise.reject(new Error('Firebase auth is not configured'))
    }

    return createUserWithEmailAndPassword(authInstance, email, password)
  }

  login(email: string, password: string) {
    if (!authInstance) {
      return Promise.reject(new Error('Firebase auth is not configured'))
    }

    return signInWithEmailAndPassword(authInstance, email, password)
  }

  logout() {
    if (!authInstance) {
      return Promise.resolve()
    }

    return signOut(authInstance)
  }

  subscribe(callback: (user: User | null) => void): () => void {
    if (!authInstance) {
      callback(null)
      return () => undefined
    }

    return onAuthStateChanged(authInstance, callback)
  }
}
