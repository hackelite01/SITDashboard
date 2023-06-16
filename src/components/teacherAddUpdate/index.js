import { useState } from 'react'
import toast from 'react-hot-toast'
import { branchList, semList } from '../../utils/deptData'
import { addDataToDB, deleteDBData, updateDataToDB } from '../../utils/firebase'

export default function TeacherAddUpdate({
  teacherData,
  handleChange,
  handleFormClose,
  handleData,
  isForm,
  addSections,
}) {
  const {
    teacherName,
    sem,
    branch,
    subcode,
    subfull,
    id,
    subshort = '',
    sections = [],
  } = teacherData

  const [isLoading, setIsLoading] = useState(false)

  // Add Data Function
  const handleAdd = async () => {
    setIsLoading(true)
    const toastId = toast.loading(<b>Adding data to DB</b>)
    try {
      await addDataToDB('teachers', {
        ...teacherData,
        teacherName: teacherName.trim(),
        subfull: subfull.trim(),
        sem: parseInt(sem),
        subshort: subshort.trim().toUpperCase(),
        subcode: subcode.trim().toUpperCase(),
      })
      setIsLoading(false)
      handleFormClose()
      toast.success(<b>{teacherName} added successfully</b>, { id: toastId })

      handleData()
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
      await updateDataToDB(`teachers/${id}`, {
        branch,
        teacherName: teacherName.trim(),
        subfull: subfull.trim(),
        sem: parseInt(sem),
        sections,
        subshort,
        subcode: subcode.trim().toUpperCase(),
      })
      setIsLoading(false)
      handleFormClose()
      toast.success(<b>{teacherName} updated successfully</b>, {
        id: toastId,
      })

      handleData()
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
      `Type 'YES'  if you want to delete data of ${teacherName}`
    )
    if (isConfirm.trim().toLowerCase() === 'yes') {
      setIsLoading(true)
      const toastId = toast.loading(<b>Deleting Data</b>)
      try {
        await deleteDBData(`teachers/${id}`)
        setIsLoading(false)
        handleFormClose()
        toast.success(<b>{teacherName} deleted successfully</b>, {
          id: toastId,
        })

        handleData()
      } catch (error) {
        console.log(error.message)
        setIsLoading(false)
        toast.error(<b>{error.message}</b>, { id: toastId })
      }
    }
  }

  // Handle SUbmit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (teacherData?.id) {
      handleUpdate()
    } else {
      handleAdd()
    }
  }

  // Handle Checkboxes
  const handleCheckbox = (e) => {
    let newSections = [...sections]
    if (e.target.checked) {
      newSections = [...sections, e.target.id]
    } else {
      newSections.splice(newSections.indexOf(e.target.id), 1)
    }
    addSections(newSections)
  }

  // Checking isChecked
  const isChecked = (value) => sections?.includes(value)

  return (
    <div className="teacherAddUpdate">
      {isForm ? (
        <form onSubmit={handleSubmit}>
          <div className="formDiv">
            <input
              type="text"
              name="teacherName"
              placeholder="Enter Teacher Name"
              value={teacherName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subfull"
              placeholder="Enter Full Subject Name"
              value={subfull}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formDiv">
            <input
              type="text"
              name="subcode"
              placeholder="Enter Subcode Eg:3140708"
              value={subcode}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subshort"
              placeholder="Subshort Eg:DM"
              value={subshort}
              onChange={handleChange}
              required
            />
            <select required name="sem" value={sem} onChange={handleChange}>
              <option value="">Choose your sem</option>
              {semList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              required
              name="branch"
              value={branch}
              onChange={handleChange}
            >
              <option value="">Choose your Branch</option>
              {branchList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="checkBoxes">
            <span className="sectionSpan">Sections:</span>
            {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((item) => (
              <div key={item} className="checkBox">
                <input
                  checked={isChecked(item)}
                  onChange={handleCheckbox}
                  type="checkbox"
                  id={item}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
          </div>
          <div className="btnDiv">
            {id ? (
              <>
                <button
                  type="submit"
                  className="btn green"
                  disabled={isLoading}
                >
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
      ) : null}
    </div>
  )
}
