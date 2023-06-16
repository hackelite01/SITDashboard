import useTitle from '../../hooks/useTitle'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import StudentsTopBar from '../../components/studentsComp/studentsTopBar'
import './students.styles.css'
import StudentsTable from '../../components/studentsComp/studentsTable'
import StudentsAddForm from '../../components/studentsComp/studentsAddForm'
import useLiveData from '../../hooks/useLiveData'

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
export default function Students() {
  // States
  const [classInfo, setClassInfo] = useState({
    sem: '',
    branch: '',
  })
  const { branch, sem } = classInfo
  const [isForm, setIsForm] = useState(false)
  const [studentData, setStudentData] = useState({
    usn: '',
    number: '',
    branch: '',
    sec: '',
    sem: '',
    status: false,
  })

  // Top Ref for scrolling
  const topRef = useRef()

  // Functions

  // Callback function for open isform
  const handleFormOpen = () => {
    setIsForm(true)
  }

  const handleGetStudents = (e, branch, sem) => {
    e.preventDefault()
    setClassInfo({
      branch,
      sem,
    })
  }

  // Callback function for close isform
  const handleFormClose = () => {
    setIsForm(false)
    setStudentData({
      usn: '',
      number: '',
      branch: '',
      sec: '',
      sem: '',
      status: false,
    })
  }

  // Changing inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update selected 1
  const handleFormUpdate = (value) => {
    setStudentData(value)
    setIsForm(true)
    topRef.current.scrollIntoView()
  }

  // Getting Live Data
  const { studentsList, isLoading } = useLiveData(branch, sem)

  useTitle('Students | SITFeedbackAdmin')

  return (
    <motion.div
      variants={wrapperVariants}
      animate="visible"
      initial="hidden"
      exit="exit"
    >
      <h1 className="adminHeadline" ref={topRef}>
        Students
      </h1>
      <StudentsTopBar
        handleGetStudents={handleGetStudents}
        isLoading={isLoading}
        isForm={isForm}
        handleFormClose={handleFormClose}
        handleFormOpen={handleFormOpen}
      />
      {isForm ? (
        <StudentsAddForm
          handleChange={handleChange}
          studentData={studentData}
          handleFormClose={handleFormClose}
        />
      ) : null}
      {studentsList && !isLoading ? (
        !studentsList?.length ? (
          <p className="noData">No students data found</p>
        ) : (
          <>
            <p className="totalStudents">
              Total : {studentsList.length} students found
            </p>
            <StudentsTable
              listData={studentsList}
              handleFormUpdate={handleFormUpdate}
            />
          </>
        )
      ) : null}
    </motion.div>
  )
}
