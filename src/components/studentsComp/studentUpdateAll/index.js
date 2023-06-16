import { doc, writeBatch } from 'firebase/firestore'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { db } from '../../../lib/firebase'
import { branchList, semList } from '../../../utils/deptData'

export default function StudentUpdateAll({
  selectedLength,
  data,
  handleClose,
}) {
  const [classInfo, setClassInfo] = useState({
    branch: '',
    sem: '',
    sec: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const { branch, sem, sec } = classInfo

  const handleChange = (e) => {
    const { name, value } = e.target
    setClassInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdate = async () => {
    if (!branch && !sem && !sec) {
      toast.error(<b>Please change anything or Close!</b>)
      return
    }
    const isConfirm = window.confirm('Are you sure you want to update?')
    if (isConfirm) {
      setIsLoading(true)
      const id = toast.loading(<b>Updating please wait..</b>)
      try {
        const batch = writeBatch(db)
        data.forEach((item) => {
          // Doc Ref
          const docRef = doc(db, 'students', item.original.id)

          const updateData = {
            ...(branch && { branch }),
            ...(sec && { sec }),
            ...(sem && { sem: parseInt(sem) }),
          }
          batch.update(docRef, updateData)
        })
        //Commiting Batch update
        batch.commit()
        setIsLoading(false)
        handleClose(false)
        toast.success(<b>Update done</b>, { id })
      } catch (error) {
        console.log(error.message)
        setIsLoading(false)
        toast.error(<b>{error.message}</b>, { id })
      }
    }
  }

  const handleDelete = async () => {
    const isConfirm = prompt(
      "Are you sure you want to delete all selected data?, If yes type : 'CONFIRM'"
    )
    if (isConfirm.trim().toLowerCase() === 'confirm') {
      setIsLoading(true)
      const id = toast.loading(<b>Deleteing all selected data..</b>)
      try {
        const batch = writeBatch(db)
        data.forEach((item) => {
          // Doc Ref
          const docRef = doc(db, 'students', item.original.id)
          batch.delete(docRef)
        })
        //Commiting Batch update
        batch.commit()
        setIsLoading(false)
        handleClose(false)
        toast.success(<b>Deleted Successfully</b>, { id })
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>, { id })
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <select name="branch" value={branch} onChange={handleChange}>
        <option value="">Change Branch</option>
        {branchList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      <select value={sem} onChange={handleChange} name="sem">
        <option value="">Change Semester</option>
        {semList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      <select value={sec} onChange={handleChange} name="sec">
        <option value="">Change Section</option>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
      <button disabled={isLoading} onClick={handleUpdate} className="btn green">
        {isLoading ? 'Loading' : `Update All : ${selectedLength}`}
      </button>
      <button disabled={isLoading} onClick={handleDelete} className="btn red">
        {isLoading ? 'Loading' : `Delete All : ${selectedLength}`}
      </button>
    </>
  )
}
