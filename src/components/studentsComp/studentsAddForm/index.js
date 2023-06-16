import { useState } from 'react'
import toast from 'react-hot-toast'
import { branchList, semList } from '../../../utils/deptData'
import {
  addStudentToDb,
  deleteDBData,
  updateDataToDB,
} from '../../../utils/firebase'
import BatchAdd from '../batchAdd'

export default function StudentsAddForm({
  studentData,
  handleChange,
  handleFormClose,
}) {
  const { usn, number, branch, sec, sem, id } = studentData

  // States
  const [isLoading, setIsLoading] = useState(false)

  // Functions
  // Add Data Function
  const handleAdd = async () => {
    setIsLoading(true)
    const toastId = toast.loading(<b>Adding data to DB</b>)
    try {
      await addStudentToDb(usn.trim().toLowerCase(), {
        ...studentData,
        usn: usn.trim().toLowerCase(),
        number: number.trim(),
        sem: parseInt(sem),
      })
      setIsLoading(false)
      handleFormClose()
      toast.success(<b>{usn.toUpperCase()} added successfully</b>, {
        id: toastId,
      })
    } catch (error) {
      console.log(error.message)
      setIsLoading(false)
      toast.error(<b>{error.message}</b>, { id: toastId })
    }
  }

  //Update Function
  const handleUpdate = async () => {
    setIsLoading(true)
    const toastId = toast.loading(<b>Updating Data</b>)
    try {
      await updateDataToDB(`students/${id}`, {
        ...studentData,
        usn: usn.trim().toLowerCase(),
        number: number.trim(),
        sem: parseInt(sem),
      })
      setIsLoading(false)
      handleFormClose()
      toast.success(<b>{usn.toUpperCase()} updated successfully</b>, {
        id: toastId,
      })
    } catch (error) {
      console.log(error.message)
      setIsLoading(false)
      toast.error(<b>{error.message}</b>, { id: toastId })
    }
  }

  //Update Function
  const handleDelete = async (e) => {
    e.preventDefault()

    const isConfirm = prompt(
      `Type 'YES'  if you want to delete data of ${usn.toUpperCase()}`
    )
    if (isConfirm.trim().toLowerCase() === 'yes') {
      setIsLoading(true)
      const toastId = toast.loading(<b>Deleting Data</b>)
      try {
        await deleteDBData(`students/${id}`)
        setIsLoading(false)
        handleFormClose()
        toast.success(<b>{usn.toUpperCase()} deleted successfully</b>, {
          id: toastId,
        })
      } catch (error) {
        console.log(error.message)
        setIsLoading(false)
        toast.error(<b>{error.message}</b>, { id: toastId })
      }
    }
  }

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (id) {
      handleUpdate()
    } else {
      handleAdd()
    }
  }

  return (
    <div className="teacherAddUpdate studentAddForm">
      <form onSubmit={handleSubmit}>
        <div className="formDiv">
          <input
            type="text"
            name="usn"
            placeholder="Enter Your USN"
            value={usn}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="number"
            minLength={10}
            maxLength={10}
            placeholder="Your Phone Number"
            value={number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formDiv">
          <select required name="branch" value={branch} onChange={handleChange}>
            <option value="">Choose your Branch</option>
            {branchList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
          <select required name="sem" value={sem} onChange={handleChange}>
            <option value="">Choose your sem</option>
            {semList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
          <select required name="sec" value={sec} onChange={handleChange}>
            <option value="">Choose your section</option>
            {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="btnDiv">
          {id ? (
            <>
              <button type="submit" className="btn green" disabled={isLoading}>
                {isLoading ? 'Updating' : 'Update'}
              </button>
              <button
                className="btn red"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting' : 'Delete'}
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="btn secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Adding' : 'Add Data'}
              </button>
            </>
          )}
        </div>
      </form>

      {!id ? (
        <BatchAdd
          handleFormClose={handleFormClose}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      ) : null}
    </div>
  )
}
