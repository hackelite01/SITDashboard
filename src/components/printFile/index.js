import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import Barchart from '../barchart'
import './printFile.style.css'

export default function PrintFile({ rankList, branch, sem }) {
  const printRef = useRef()
  return (
    <>
      <div className="printDiv" ref={printRef}>
        <h1>Saffrony Institute of Technology</h1>
        <h2>
          Feedback Report for Semester {sem}, {branch?.toUpperCase()}
        </h2>
        <p className="date">{new Date().toDateString()}</p>
        <h3 className="printH3">Rankings</h3>
        <div className="rankBoardDiv">
          {rankList.map((item, i) => (
            <div key={i} className="rankCard">
              <div className="rankNo">{i + 1}</div>
              <p className="teacherName">{item.teacherName}</p>
              <p className="subjects">
                {item.subfull} ,<span className="subCode"> {item.subcode}</span>
              </p>
              <p className="point">
                {Math.round((item.avgRating / 50) * 100)}%
              </p>
            </div>
          ))}
        </div>

        <div className="page_break" />
        {/* Page 2 */}
        <h3 className="printH3">Bar Chart</h3>
        {/* <div className="barChart"> */}
        <Barchart horizontal={true} data={rankList} />
        {/* </div> */}
      </div>

      <div className="printWrapper">
        <p>Print Report</p>
        <ReactToPrint
          documentTitle={`Feedback_Report_${new Date().toDateString()}`}
          trigger={() => (
            <button className="btn primary">Print and Save</button>
          )}
          content={() => printRef.current}
        />
      </div>
    </>
  )
}
{
  /* {[...Array(15)].map((item, i) => (
            <div key={i} className="rankCard">
              <div className="rankNo">{i + 1}</div>
              <p className="teacherName">GHGSba ashags YGFs</p>
              <p className="subjects">
                aiuhdiwah gsuvdwa dsyagd awdb ,
                <span className="subCode">UAHSsdajd</span>
              </p>
              <p className="point">76%</p>
            </div>
          ))} */
}
