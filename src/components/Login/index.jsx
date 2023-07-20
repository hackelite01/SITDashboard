import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { auth } from '../../lib/firebase'
import { toast } from 'react-hot-toast'
import './login.style.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useRef } from 'react'

export default function Login({ user }) {
  const location = useLocation()
  const navigate = useNavigate()

  const redirPath = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Cancel Ref
 // const isCancel = useRef()
 // isCancel.current = false

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading(<b>Signing In Please Wait</b>)
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password.trim()
      )
      if (res.user) {
        toast.success(<b>Signin Successfull</b>, { id: toastId })
        if (!isCancel.current) {
          navigate(redirPath, { replace: true })
          setIsLoading(false)
        }
      } else {
        throw new Error('Something went wrong try again')
      }
    } catch (error) {
      toast.error(<b>{error.message}</b>, {
        id: toastId,
      })
      console.log(error.message)
      if (!isCancel.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/')
    }
    return () => (isCancel.current = true)
  }, [isLoading, navigate, isCancel])

  return (
    <div className="loginWrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          required
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          name="password"
          minLength={6}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={isLoading}>{isLoading ? 'Loading' : 'Signin'}</button>
      </form>
    </div>
  )
}
