import { useReducer } from 'react'
import { useContext } from 'react'
import { createContext } from 'react'

const MainDataContext = createContext()

export const useMainData = () => useContext(MainDataContext)

const INITIAL_STATE = {
  teacherData: null,
  rankList: [],
  branch: '',
  sem: '',
  adminName: '',
  master: false,
  studentsList: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_DATA':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      }
    case 'RANKS_EMPTY':
      return {
        ...state,
        rankList: [],
      }
    case 'ADD_ADMIN_DATA':
      return {
        ...state,
        branch: action.payload.branch,
        adminName: action.payload.name,
        master: action.payload.master,
      }
    default:
      return state
  }
}

export default function MainDataContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  return (
    <MainDataContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MainDataContext.Provider>
  )
}
