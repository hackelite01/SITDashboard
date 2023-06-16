import { useRef, useState } from 'react'
import useTitle from '../../hooks/useTitle'
import { clearAndCreate, generateRanking } from '../../utils/firebase'
import { motion } from 'framer-motion'
import LoaderSvg from '../../components/loaderSvg'
import './home.style.css'
import Barchart from '../../components/barchart'
import ReviewDetails from '../../components/reviewdetails'
import SendReports from '../../components/sendReports'
import {
  basicSelect,
  branchSelect,
  deptList,
  semSelect,
} from '../../utils/deptData'

import { toast } from 'react-hot-toast'
import { useMainData } from '../../context/mainDataContext'
import PrintFile from '../../components/printFile'

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
      duration: 0.35,
    },
  },
  exit: {
    y: 140,
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

const rankBoardVariants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      mass: 0.7,
      when: 'beforeChildren',
      staggerChildren: 0.4,
    },
  },

  exit: {
    y: 200,
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

const rankCardVariants = {
  hidden: { opacity: 0, rotateX: -180 },

  visible: {
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.4,
    },
  },
}

export default function Home() {
  useTitle('Home | SITFeedbackAdmin')
  // States

  const { rankList, branch, sem, master, dispatch } = useMainData()

  const [isLoading, setIsLoading] = useState(false)
  const [clearLoading, setClearLoading] = useState(false)
  // const [rankList, setRankList] = useState([])
  const [isNoData, setIsNoData] = useState(false)
  const scrollRef = useRef()

  // Functions
  const handleGenerate = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    const data = await generateRanking(branch, parseInt(sem))
    if (data?.length) {
      setIsLoading(false)
      setIsNoData(false)
      dispatch({
        type: 'ADD_DATA',
        payload: { name: 'rankList', value: data },
      })
      scrollRef.current.scrollIntoView()
    } else {
      setIsLoading(false)
      setIsNoData(true)
      dispatch({
        type: 'RANKS_EMPTY',
      })
    }
  }

  // Handling Inputs
  const handleChange = (e) => {
    if (rankList?.length) dispatch({ type: 'RANKS_EMPTY' })
    const { name, value } = e.target
    dispatch({ type: 'ADD_DATA', payload: { name, value } })
  }

  //Clearing Data
  const handleClear = async (e) => {
    e.preventDefault()
    if (!branch || !sem) return
    setIsNoData(false)
    setClearLoading(true)
    const sure = window.confirm(
      'Are you sure want to clear previous data and create new feedbacks?'
    )
    if (sure) {
      const toastId = toast.loading('Clearning Previous Data')
      try {
        await clearAndCreate(branch, parseInt(sem))
        toast.success(
          'Data cleared and Ready to collect new feedback for branch ' +
            branch +
            ' sem ' +
            sem,
          {
            id: toastId,
          }
        )
        dispatch({ type: 'RANKS_EMPTY' })
        dispatch({ type: 'ADD_DATA', payload: { name: 'sem', value: '' } })
      } catch (error) {
        toast.error('Something went wrong, Try Again!', { id: toastId })
        console.log(error)
      }
    }
    setClearLoading(false)
  }

  // Total Calculating
  let reviewsGiven = 0
  rankList?.forEach((item) => {
    reviewsGiven += item.total
  })

  return (
    <motion.div
      variants={wrapperVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="adminHeadline">Home</h1>
      <h2 className="generateH2">Generate Review</h2>
      <div className="generateDiv">
        <p>{master ? 'Select Department and Semester' : 'Select Semester'}</p>
        <form onSubmit={handleGenerate}>
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

          {branch && (
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
          )}

          <button
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
            type="submit"
          >
            {isLoading ? (
              <LoaderSvg />
            ) : rankList?.length > 0 ? (
              'Refresh'
            ) : (
              'Generate'
            )}
          </button>
          {branch && sem && (
            <button
              disabled={clearLoading}
              onClick={handleClear}
              className="clear"
            >
              {clearLoading ? 'Please wait' : 'Clear and Create New Feedbacks'}
            </button>
          )}
        </form>
        {isNoData && <p className="noData">No Data Found</p>}

        {rankList?.length > 0 && (
          <>
            <div ref={scrollRef}></div>
            <div className="rankBoardDetails">
              Rankings Generated for Semester :<span> {sem}</span> , Branch :
              <span> {deptList[branch]}</span>
            </div>
            {reviewsGiven ? (
              <>
                <ReviewDetails
                  reviewsGiven={reviewsGiven}
                  branch={branch}
                  sem={sem}
                />
                <h3 className="rankingH3">Rankings</h3>
                <motion.div
                  variants={rankBoardVariants}
                  className="rankBoardDiv"
                >
                  {rankList.map((item, i) => (
                    <motion.div
                      variants={rankCardVariants}
                      key={i}
                      className="rankCard"
                    >
                      <div className="rankNo">{i + 1}</div>
                      <p className="teacherName">{item.teacherName}</p>
                      <p className="subjects">
                        {item.subfull} ,
                        <span className="subCode"> {item.subcode}</span>
                      </p>
                      <p className="point">
                        {Math.round((item.avgRating / 50) * 100)}%
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
                <hr />
                <h3 className="rankingH3">Bar Chart</h3>
                <div className="barChart">
                  <Barchart data={rankList} />
                </div>
                <hr />
                <h2 className="rankingH2">Send and Save the Report</h2>
                <SendReports />
                <PrintFile branch={branch} sem={sem} rankList={rankList} />
              </>
            ) : (
              <p className="noReviewGot">Couldn't get any Review Data</p>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
