import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function RequireAuth({ children, user }) {
  const location = useLocation()

  return user ? (
    <Outlet />
  ) : (
    <motion.div>
      <Navigate to='/login' replace state={{ from: location.pathname }} />
    </motion.div>
  )
}
