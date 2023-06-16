import { useState } from 'react'
import toast from 'react-hot-toast'
import './sendReports.style.css'

export default function SendReports() {
  const [email, setEmail] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.error(<b>Currently unavailable</b>)
  }
  return (
    <form onSubmit={handleSubmit} className="sendReportWrapper">
      <p>Send Report to</p>
      <select
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      >
        <option value="">Select Recipient</option>
        <option value="prip">Principal Of SIT</option>
        <option value="cse">HOD of CE Branch</option>
        <option value="it">HOD of IT Branch</option>
        <option value="me">HOD of ME Branch</option>
        <option value="ece">HOD of ECE Branch</option>
        <option value="civil">HOD of CIVIL Branch</option>
      </select>
      <button type="submit">Send</button>
    </form>
  )
}
