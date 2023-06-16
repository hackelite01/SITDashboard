import { Link, NavLink } from 'react-router-dom'
import {
  FaHome,
  FaUserGraduate,
  FaUserTie,
  FaBook,
  FaSignOutAlt,
  FaSignInAlt,
} from 'react-icons/fa'
import './homeLayout.style.css'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { toast } from 'react-hot-toast'

import { useMainData } from '../../context/mainDataContext'

export default function HomeLayout({ children, user }) {
  const { adminName } = useMainData()
  const handleSignout = () => {
    signOut(auth)
      .then(() => toast.success('Signed Out Successfull'))
      .catch(() => toast.error('Signout failed'))
  }
  return (
    <div className="admin">
      <div className="adminGrid">
        <div className="sideMenu">
          <div className="sideLogo">
            <span>SIT Feedback</span> Admin
          </div>
          <div className="menuItemsWrapper">
            <NavLink to="" end={true}>
              <FaHome /> Home
            </NavLink>
            <NavLink to="students" end={true}>
              <FaUserGraduate />
              Students
            </NavLink>

            <NavLink to="teachers" end={true}>
              <FaUserTie />
              Teacher
            </NavLink>

            <NavLink to="classes" end={true}>
              <FaBook /> Classes
            </NavLink>
          </div>
          {user && <p className="userName">{adminName || 'Admin'}</p>}
          <div className="logOutDiv">
            {user ? (
              <button onClick={handleSignout}>
                Logout <FaSignOutAlt />
              </button>
            ) : (
              <Link to="/login">
                Login <FaSignInAlt />
              </Link>
            )}
          </div>
        </div>
        <div className="mainContent">{children}</div>
      </div>
    </div>
  )
}
