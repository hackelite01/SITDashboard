import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useState } from 'react'
import { auth, firebaseApp } from '../lib/firebase'

export default function useAuth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Login
        localStorage.setItem('user', JSON.stringify(authUser))
        setUser(authUser)
      } else {
        // Logout
        localStorage.removeItem('user')
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [firebaseApp])

  return user
}
