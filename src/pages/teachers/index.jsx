import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import TeacherAddUpdate from '../../components/teacherAddUpdate'
import TeacherList from '../../components/teacherLists'
import { useMainData } from '../../context/mainDataContext'
import useTitle from '../../hooks/useTitle'
import { getDBData } from '../../utils/firebase'
import './teachers.style.css'

const wrapperVariants = {
  hidden: {
    opacity: 0,
    y: -70,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.7, ease: 'easeInOut' },
      duration: 0.3,
    },
  },
  exit: {
    y: 140,
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

export default function Teachers() {
  const [isLoading, setIsLoading] = useState(false)
  const [teacherData, setTeacherData] = useState({
    teacherName: '',
    branch: '',
    sem: '',
    subcode: '',
    subfull: '',
    total: 0,
    avgRating: 0,
    subshort: '',
    sections: [],
  })
  const [isForm, setIsForm] = useState(false)

  // Teacher Context
  const { teacherData: data, dispatch } = useMainData()

  // Refs
  // Scroll Ref
  const topRef = useRef()

  // Callback function for isformChange
  const handleFormOpen = () => {
    setIsForm(true)
  }

  // Callback function for close isform
  const handleFormClose = () => {
    setTeacherData({
      teacherName: '',
      branch: '',
      sem: '',
      subcode: '',
      subfull: '',
      total: 0,
      avgRating: 0,
      subshort: '',
      sections: [],
    })
    setIsForm(false)
  }

  // Changing Inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setTeacherData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  // Changing Sections
  const addSections = (value) => {
    setTeacherData((prev) => ({
      ...teacherData,
      sections: value,
    }))
  }

  // Callback function for single row editing
  const handleEditBtn = (item) => {
    setIsForm(true)
    topRef.current.scrollIntoView()
    setTeacherData(item)
  }

  // Getting teacher lists
  const handleClick = async () => {
    setIsLoading(true)
    const id = toast.loading(<b>Getting teacher lists</b>)
    try {
      const res = await getDBData('teachers')
      if (res) {
        dispatch({
          type: 'ADD_DATA',
          payload: { name: 'teacherData', value: res },
        })
      }
      toast.success(<b>Got the data</b>, { id })
      setIsLoading(false)
    } catch (error) {
      toast.error(<b>{error.message}</b>, { id })
      console.log(error.message)
      setIsLoading(false)
    }
  }

  useTitle('Teachers | SITFeedbackAdmin')
  return (
    <motion.div
      variants={wrapperVariants}
      animate="visible"
      initial="hidden"
      exit="exit"
      className="teachersWrapper"
    >
      <h1 className="adminHeadline" ref={topRef}>
        Teachers
      </h1>
      <p className="intro">
        Click <strong>Get Teachers List</strong> button to get teacher data or
        refresh teacher data, Click on any column for <strong>sorting</strong>,
        To search text pattern just type in the <strong>Search bar</strong> and
        to add data click <strong>Add Data</strong> button.
      </p>
      <div className="mainBtnDiv">
        <button
          onClick={handleClick}
          className="btn primary medium"
          disabled={isLoading}
        >
          {isLoading
            ? 'Loading..'
            : data
            ? 'Refresh Data'
            : 'Get Teachers List'}
        </button>

        <button
          onClick={isForm ? handleFormClose : handleFormOpen}
          className={`btn ${isForm ? 'border-grey' : 'border-blue'}`}
        >
          {isForm ? 'Close' : 'Add data'}
        </button>
      </div>
      <TeacherAddUpdate
        handleFormClose={handleFormClose}
        isForm={isForm}
        handleChange={handleChange}
        teacherData={teacherData}
        handleData={handleClick}
        addSections={addSections}
      />
      {data && !isLoading ? (
        !data?.length ? (
          <p className="noData">No teacher data found</p>
        ) : (
          <TeacherList handleEditBtn={handleEditBtn} listData={data} />
        )
      ) : null}
    </motion.div>
  )
}
