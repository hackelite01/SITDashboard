import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './components/Login'
import RequireAuth from './components/requireAuth'
import { useMainData } from './context/mainDataContext'
import useAuth from './hooks/useAuth'
import HomeLayout from './layout/homeLayout'
import Classes from './pages/classes'
import Home from './pages/home'
import Students from './pages/students'
import Teachers from './pages/teachers'
import { getProfile } from './utils/firebase'

export default function App() {
  const location = useLocation()
  const user = useAuth()
  const uid = user?.uid
  // States
  const [loading, setLoading] = useState(true)
  const { dispatch } = useMainData()

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProfile(uid)
      if (res) {
        dispatch({
          type: 'ADD_ADMIN_DATA',
          payload: {
            branch: res.branch === 'master' ? '' : res.branch,
            name: res?.name,
            master: res.branch === 'master' ? true : false,
          },
        })
      }
      setLoading(false)
    }
    if (uid) {
      fetchData()
    }
  }, [uid])

  if (uid && loading) {
    return <div className="loadingMain">Loading...</div>
  } else {
    return (
      <>
        <HomeLayout user={user}>
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              <Route element={<RequireAuth user={user} />}>
                <Route path="/" element={<Home />} />
                <Route path="/students" element={<Students />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/classes" element={<Classes />} />
              </Route>
              <Route path="/login" element={<Login user={user} />} />
            </Routes>
          </AnimatePresence>
        </HomeLayout>
        <div className="mobileVersion">
          This app is not supported in this width
        </div>
        <Toaster />
      </>
    )
  }
}
