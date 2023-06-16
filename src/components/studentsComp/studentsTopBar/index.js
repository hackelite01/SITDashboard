import { useState } from 'react'
import { useMainData } from '../../../context/mainDataContext'
import { basicSelect, branchSelect, semSelect } from '../../../utils/deptData'

export default function StudentsTopBar({
  handleGetStudents,
  isLoading,
  isForm,
  handleFormClose,
  handleFormOpen,
}) {
  const { branch: mainBranch, master } = useMainData()

  // States
  const [sem, setSem] = useState()
  const [branch, setBranch] = useState(mainBranch)

  // Functions
  // Clicking add data
  const handleClick = (e) => {
    e.preventDefault()
    if (isForm) {
      handleFormClose()
    } else {
      handleFormOpen()
    }
  }

  return (
    <div className="getStudents">
      <p>{master ? 'Select Department and Semester' : 'Select Semester'}</p>
      <form onSubmit={(e) => handleGetStudents(e, branch, sem)}>
        {master ? (
          <select
            required
            name="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
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
          <select
            required
            name="sem"
            value={sem}
            onChange={(e) => setSem(e.target.value)}
          >
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
          className="btn primary medium"
          type="submit"
        >
          {isLoading ? 'Getting Data' : 'Get Students'}
        </button>
        <button
          onClick={handleClick}
          className={`btn ${isForm ? 'border-grey' : 'border-blue'}`}
        >
          {isForm ? 'Close' : 'Add data'}
        </button>
      </form>
    </div>
  )
}
