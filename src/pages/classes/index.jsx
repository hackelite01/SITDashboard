import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import LoaderSvg from '../../components/loaderSvg'
import { useMainData } from '../../context/mainDataContext'
import useTitle from '../../hooks/useTitle'
import { basicSelect, branchSelect, semSelect } from '../../utils/deptData'
import { getClassFromDB } from '../../utils/firebase'
import './classes.styles.css'

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

const listVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.7, ease: 'easeInOut' },
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: {
    scaleY: -1,
    opacity: 0,
  },
  visible: {
    scaleY: 1,
    opacity: 1,
  },
}

export default function Classes() {
  const { branch: mainBranch, master } = useMainData()

  const [classLists, setClassLists] = useState()

  const [isLoading, setIsLoading] = useState(false)

  const [classData, setClassData] = useState({
    branch: mainBranch,
    sem: '',
    section: '',
  })
  const { branch, sem, section } = classData

  // Functuons
  const handleGetTeacher = async (e) => {
    e.preventDefault()
    setClassLists()
    setIsLoading(true)
    const id = toast.loading(<b>Collecting Class data</b>)
    try {
      const res = await getClassFromDB(branch, parseInt(sem), section)
      if (res) {
        setClassLists(res)
      } else {
        setClassLists([])
      }
      setIsLoading(false)
      toast.success(<b>Got the data</b>, { id })
    } catch (error) {
      console.log(error.message)
      setIsLoading(false)
      toast.error(<b>{error.message}</b>, { id })
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setClassLists()
    setClassData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useTitle('Classes | SITFeedbackAdmin')
  return (
    <motion.div
      variants={wrapperVariants}
      animate="visible"
      initial="hidden"
      exit="exit"
    >
      <h1 className="adminHeadline">Classes</h1>
      <h2 className="generateH2">Get Class Details</h2>
      <div className="generateDiv">
        <p>Select Class</p>
        <form onSubmit={handleGetTeacher}>
          {master ? (
            <select
              required
              name="branch"
              value={branch}
              onChange={handleChange}
            >
              <option value="">Choose Branch</option>
              {branchSelect.map((branch, i) => (
                <option key={i} value={branch.value}>
                  {branch.name}
                </option>
              ))}
            </select>
          ) : null}

          {branch ? (
            <select required name="sem" value={sem} onChange={handleChange}>
              <option value="">Select Semester</option>
              {!(branch === 'bs')
                ? semSelect.map((semItem, i) => (
                    <option value={semItem.value} key={i}>
                      {semItem.name}
                    </option>
                  ))
                : basicSelect.map((semItem, i) => (
                    <option value={semItem.value} key={i}>
                      {semItem.name}
                    </option>
                  ))}
            </select>
          ) : null}
          {branch ? (
            <select
              required
              name="section"
              value={section}
              onChange={handleChange}
            >
              <option value="">Choose section</option>
              {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((sectionItem) => (
                <option value={sectionItem} key={sectionItem}>
                  {sectionItem.toUpperCase()}
                </option>
              ))}
            </select>
          ) : null}
          <button
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
            type="submit"
          >
            {isLoading ? (
              <LoaderSvg />
            ) : classLists?.length > 0 ? (
              'Refresh'
            ) : (
              'Get Data'
            )}
          </button>
        </form>
      </div>
      {classLists ? (
        classLists?.length ? (
          <motion.div variants={listVariants}>
            <div className="classesWrapper">
              <p className="classHeader">
                {`Semester ${sem}, ${section.toUpperCase()} section, ${branch.toUpperCase()}`}
              </p>
              <div className="classLists">
                {classLists.map((item, i) => (
                  <motion.div
                    variants={cardVariants}
                    key={i}
                    className="classTeacherCard"
                  >
                    <p className="name">{item?.teacherName}</p>
                    <p className="subject">{item?.subfull}</p>
                    <div className="bottom">
                      <span>{item?.subcode || 'Not Found'}</span>
                      <span>{item?.subshort || 'Not Found'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="noData">No Data Found</p>
        )
      ) : null}
    </motion.div>
  )
}
