import { useState } from 'react'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from '../../../lib/firebase'

export default function BatchAdd({ setIsLoading, isLoading, handleFormClose }) {
  const [file, setFile] = useState()
  const acceptedFiles = ['application/ csv', 'text/csv', '.csv']

  // Functions

  // Handling Batch
  const handleData = async (results, id) => {
    const batch = writeBatch(db)

    // Set the value of 'NYC'
    results.data?.forEach((element) => {
      const { usn, branch, sem, sec, number } = element
      const docRef = doc(db, 'students', usn.trim().toLowerCase())
      batch.set(docRef, {
        usn: usn.trim().toLowerCase(),
        number: number.trim(),
        sem: parseInt(sem),
        branch: branch.trim().toLowerCase(),
        sec: sec.trim().toLowerCase(),
        status: false,
      })
    })

    // Commit the batch
    await batch.commit()
    setIsLoading(false)
    handleFormClose()
    toast.success(<b>All Data Added</b>, { id })
  }

  // Upload all files
  const handleUpload = async (e) => {
    e.preventDefault()

    if (file) {
      if (!acceptedFiles.includes(file.type)) {
        toast.error(<b>Only CSV type file supported.</b>)
      } else {
        let isConfirm = prompt(
          "Did you double check all conditions, if yes type: 'CONFIRM'"
        )
        if (isConfirm.trim().toLowerCase() === 'confirm') {
          setIsLoading(true)
          const id = toast.loading(<b>Adding all data, Dont quit!</b>)
          try {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              complete: (result) => handleData(result, id),
            })
          } catch (error) {
            console.log(error.message)
            toast.error(<b>{error.message}</b>, { id })
            setIsLoading(false)
          }
        }
      }
    }
  }

  return (
    <div className="batchAddDiv">
      <h3>Add in Batch</h3>
      <div className="code">
        <p>
          Please use this function with proper checks :
          <strong> 1. Without any missing values</strong>,{' '}
          <strong>
            2.File should be like below structure and in CSV format
          </strong>
          .
        </p>
        <p>
          <strong>Enrollment,branch,sem,sec,number</strong>
          <br />
          210390107031,ce,7,a,9886754356
          <br />
          210390107031,ce,8,b,6754546713
          <br />
          ........
        </p>
      </div>
      <form onSubmit={handleUpload}>
        <div className="formDiv">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            required
          />
          <button disabled={isLoading} className="btn secondary" type="submit">
            {isLoading ? 'Loading' : 'Add All'}
          </button>
        </div>
      </form>
    </div>
  )
}
